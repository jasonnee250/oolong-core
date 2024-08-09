import {OolongText} from "@/text/base/OolongText";
import {OolongParagraph} from "@/text/base/OolongParagraph";
import {OolongCharacter} from "@/text/base/OolongCharacter";
import {IGraphicElement, Point, RectNode} from "dahongpao-core";
import {GMLRender} from "dahongpao-core/dist/render/GMLRender";
import {RenderInput} from "@/text/input/RenderInput.ts";
import {Rect} from "@/text/base/Rect.ts";
import {EditPositionInfo} from "@/text/base/EditPositionInfo.ts";
import {LinkNode} from "@/text/base/OolongLink.ts";
import {NodeManager} from "dahongpao-canvas";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {ParagraphSpacing} from "@/text/config/OolongTextConstants.ts";
import {PageManager} from "@/page/PageManager.ts";
import {DeleteTextLog, EditTextLog} from "@/action/log/text/EditDeleteTextLog.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {Page} from "@/page/Page.ts";
import {TextCharUnit} from "@/action/log/text/TextCharUnit.ts";
import {TextListEnum} from "@/text/base/TextListInfo.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {RenderManager} from "@/action/render/RenderManager.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";

export class TypeWriter {

    oolongText: OolongText;
    gmlRender: GMLRender;
    renderInput: RenderInput;
    editPosition: EditPositionInfo;
    nodeManager: NodeManager;
    pageManager: PageManager;
    /**
     * 是否为拼音输入模式
     */
    duringComposition: boolean = false;

    constructor(oolongText: OolongText, gmlRender: GMLRender, renderInput: RenderInput, nodeManager: NodeManager, pageManager: PageManager) {
        this.oolongText = oolongText;
        this.gmlRender = gmlRender;
        this.renderInput = renderInput;
        const paragraphPtr = oolongText.tail.prev!;
        const linePtr = paragraphPtr!.data!.tail.prev!;
        const charPtr = linePtr!.data!.tail.prev!;
        this.editPosition = new EditPositionInfo(paragraphPtr, linePtr, charPtr);
        this.nodeManager = nodeManager;
        this.pageManager = pageManager;
    }

    //todo 复杂度可以优化，目前是3n,可以改成二叉查找，复杂度3*logn
    loadEditPosition(textCursorPosition: TextCursorPosition): void {
        this.editPosition = this.oolongText.getPositionPtrFromCursorPosition(textCursorPosition);
    }

    getEditPosition(): TextCursorPosition {
        return this.editPosition.serializeTo();
    }

    typeCharacterChars(editTextLog: EditTextLog,renderManager:RenderManager): Rect | null {
        const {editText: chars} = editTextLog;
        if (chars.length === 0) {
            return null;
        }
        const {oolongText} = this;
        let paragraphPtr = this.editPosition.paragraphPtr;
        let linePtr = this.editPosition.linePtr;
        let charPtr = this.editPosition.charPtr;
        if (!paragraphPtr) {
            throw new Error("paragraphs数据错误");
        }
        if (!linePtr) {
            throw new Error("lines 数据错误");
        }
        if (!charPtr) {
            throw new Error("char 数据错误");
        }

        const prevRect = this.oolongText.getRect(this.editPosition.paragraphPtr!, this.editPosition.linePtr!);

        let endCharPtr: OolongCharacter | null = null;
        let endParagraphPtr: LinkNode<OolongParagraph> | null = null;

        this.oolongText.graphicContext.font = oolongText.getFontDefine(paragraphPtr.data!.fontSize);
        let i = 0;
        for (const charData of chars) {
            i++;
            if (charData.char === "\n") {
                const newParagraphData = new OolongParagraph(oolongText);
                const newParagraphPtr = new LinkNode(newParagraphData);
                newParagraphPtr.data!.listInfo = paragraphPtr.data!.listInfo;
                if (paragraphPtr.data!.listInfo.listType === TextListEnum.Ordered) {
                    const orderNum = paragraphPtr.data!.listInfo.orderNum! + 1;
                    newParagraphPtr.data!.listInfo = {...paragraphPtr.data!.listInfo, orderNum};
                    newParagraphPtr.data!.fontSize = paragraphPtr.data!.fontSize;
                }
                const point = new Point(paragraphPtr.data?.head.next?.data!.x,
                    paragraphPtr.data!.tail.prev!.data!.y + paragraphPtr.data!.tail.prev!.data!.height + ParagraphSpacing);
                const page = paragraphPtr.data!.tail.prev!.data?.parent || null;
                newParagraphData.initLine(newParagraphPtr, point, page as Page);
                paragraphPtr.add(newParagraphPtr);
                const cacheNewLine = newParagraphPtr.data!.head.next!;
                let cacheCharIter = cacheNewLine.data!.head;
                {
                    const cb = (char: LinkNode<OolongCharacter>) => {
                        cacheCharIter.next = char;
                        char.prev = cacheCharIter;
                        cacheCharIter = char;
                    }
                    paragraphPtr.data!.iterCharCallBack(charPtr.next!, linePtr, cb);
                    cacheCharIter.next = cacheNewLine.data!.tail;
                    cacheNewLine.data!.tail.prev = cacheCharIter;
                }
                //文字链表修改
                charPtr.next = linePtr.data!.tail;
                linePtr.data!.tail.prev = charPtr;
                //行链表修改
                linePtr.next = paragraphPtr.data!.tail;
                paragraphPtr.data!.tail.prev = linePtr;

                linePtr = newParagraphPtr.data!.head.next!;//首行
                charPtr = linePtr.data!.head;//head行首
                paragraphPtr = newParagraphPtr;
                endCharPtr = null;
                endParagraphPtr = newParagraphPtr;
                continue;
            }
            const result = this.oolongText.graphicContext.measureText(charData.char);
            const height = result.fontBoundingBoxAscent + result.fontBoundingBoxDescent;
            const width = result.width;
            const oolongCharacter = new OolongCharacter(charData.char, 0, 0, width, height);
            oolongCharacter.italic = charData.italic;
            oolongCharacter.bold = charData.bold;
            oolongCharacter.color = charData.color;
            const linkCharacter = new LinkNode(oolongCharacter);
            oolongCharacter.initChar(linePtr, linkCharacter);
            charPtr.add(linkCharacter);
            charPtr = linkCharacter;
            endCharPtr = oolongCharacter;
            endParagraphPtr = null;
        }
        editTextLog.deleteTextLog = new DeleteTextLog(i);
        //******************************* 数据模型整理完毕，开始重排版 ************************************/
        const nextRect = oolongText.reTypesetting(this.pageManager, this.editPosition);
        const rect = Rect.getRectBounds([prevRect, nextRect]);

        if (oolongText.toNodeId !== null) {
            const line=this.nodeManager.lineMap.get(oolongText.toNodeId) as OolongLine|undefined;
            if(line){
                const cachePos=line.computeTextPos()!;
                oolongText.updatePos(cachePos);
                const cursorPosition=new TextCursorPosition(0,0,-1);
                const positionPtr=oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                oolongText.reTypesetting(this.pageManager,positionPtr);
            }

            const node = this.nodeManager.nodeMap.get(oolongText.toNodeId) as OolongNode | undefined;
            if (node) {
                const point=this.getCursorPosition();
                if (endCharPtr) {
                    const pos=endCharPtr.linePtr!.data!.globalPos();
                    point.y=pos.y;
                } else if (endParagraphPtr) {
                    const pos=endParagraphPtr.data!.head.next!.data!.globalPos();
                    point.y=pos.y;
                }

                let cachePos;
                const textRectNode=oolongText.getRectNode();
                const textContentRect=node.getTextContentRect();

                if((textRectNode.maxY-textRectNode.minY)<textContentRect.height){
                    cachePos=node.computeTextPos();
                }else{
                    cachePos = new Point(this.oolongText.x,this.oolongText.y);
                }
                const lineHeight=this.editPosition.linePtr!.data!.height;
                //超过底边
                if (point.y+lineHeight  > textContentRect.y + textContentRect.height) {
                    cachePos.y=cachePos.y-(point.y+lineHeight - textContentRect.y - textContentRect.height);
                }
                //超过上边
                if (point.y  < textContentRect.y) {
                    cachePos.y=cachePos.y+( textContentRect.y - point.y);
                }
                oolongText.updatePos(cachePos);
                const cursorPosition = new TextCursorPosition(0, 0, -1);
                const positionPtr = oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                oolongText.reTypesetting(this.pageManager, positionPtr);

            }
        }

        //******************************* 重排版完毕，清空矩形区域并重绘 ************************************/
        renderManager.addDrawNode(this.oolongText);

        //******************************* 更新光标位置 & editPosition ************************************/
        if (endCharPtr) {
            this.editPosition.paragraphPtr = endCharPtr.linePtr!.data!.paragraphPtr;
            this.editPosition.linePtr = endCharPtr.linePtr;
            this.editPosition.charPtr = endCharPtr.linkPtr;
        } else if (endParagraphPtr) {
            this.editPosition.paragraphPtr = endParagraphPtr;
            this.editPosition.linePtr = endParagraphPtr.data!.head.next;
            this.editPosition.charPtr = endParagraphPtr.data!.head.next!.data!.head;
        }
        this.updateEditPositionCursor();
        const textRectNode = this.oolongText.getRectNode();
        this.nodeManager.removeIndexNode(textRectNode);
        this.nodeManager.addIndexNode(textRectNode);
        return rect;
    }

    // typeNewLine(): Rect | null {
    //     return this.typeCharacterChars('\n');
    // }

    backSpaceLeftOne(textCharList: TextCharUnit[]): void {
        const paragraphPtr = this.editPosition.paragraphPtr;
        const linePtr = this.editPosition.linePtr;
        const charPtr = this.editPosition.charPtr;
        if (!paragraphPtr) {
            throw new Error("paragraphs数据错误");
        }
        if (!linePtr) {
            throw new Error("lines 数据错误");
        }
        if (!charPtr) {
            throw new Error("char 数据错误");
        }
        //******************************* 所在行前一位有字符 ************************************/
        const originLinePtr = this.editPosition.linePtr!.prev!;
        if (charPtr.prev !== null) {
            //段落不变，line，char变
            this.editPosition.charPtr = charPtr.prev;
            this.editPosition.linePtr = originLinePtr.next;
            const prev = charPtr.prev;
            charPtr.next!.prev = prev;
            prev.next = charPtr.next;
            charPtr.prev = null;
            charPtr.next = null;
            textCharList.unshift(charPtr.data!.serializeToEditLog());
            return;
        }
        //******************************* 在行首，但是所在段落有上一行 ************************************/
        const prevLinePtr = linePtr.prev!;
        if (prevLinePtr.data !== null) {
            this.editPosition.linePtr = prevLinePtr;
            const deleteChar = prevLinePtr.data!.tail.prev!;
            this.editPosition.charPtr = deleteChar.prev!;
            const prev = deleteChar.prev!;
            prevLinePtr.data.tail.prev = prev;
            prev.next = prevLinePtr.data!.tail;
            deleteChar.prev = null;
            deleteChar.next = null;
            textCharList.unshift(deleteChar.data!.serializeToEditLog())
            return;
        }
        //******************************* 在行首，并且所在段落没有上一行，但是有上一段落 ************************************/
        const prevParagraphPtr = paragraphPtr.prev!;
        if (prevParagraphPtr.data !== null) {
            this.editPosition.paragraphPtr = prevParagraphPtr;
            this.editPosition.linePtr = prevParagraphPtr.data!.tail.prev!;
            this.editPosition.charPtr = this.editPosition.linePtr.data!.tail.prev!;
            //段落删除
            prevParagraphPtr.next = paragraphPtr.next;
            paragraphPtr.next!.prev = prevParagraphPtr;
            paragraphPtr.prev = null;
            paragraphPtr.next = null;
            //段落行移动到另一段落
            prevParagraphPtr.data.tail.prev!.next = linePtr;
            linePtr.prev = prevParagraphPtr.data.tail.prev!;
            paragraphPtr.data!.head.next = paragraphPtr.data!.tail;
            paragraphPtr.data!.tail.prev = paragraphPtr.data!.head;
            textCharList.unshift(new TextCharUnit("\n"));
            return;
        }
        return;
        //******************************* 在行首并且并且所在段落没有上一行，没有上一段落 ************************************/
    }

    backSpaceLeft(deleteTextLog: DeleteTextLog,renderManager:RenderManager): Rect | null {
        const {deleteNum: times} = deleteTextLog;
        const paragraphPtr = this.editPosition.paragraphPtr;
        const linePtr = this.editPosition.linePtr;
        const charPtr = this.editPosition.charPtr;
        if (!paragraphPtr) {
            throw new Error("paragraphs数据错误");
        }
        if (!linePtr) {
            throw new Error("lines 数据错误");
        }
        if (!charPtr) {
            throw new Error("char 数据错误");
        }
        //******************************* 首段，首行，行首判断 ************************************/
        if (paragraphPtr === this.oolongText.head.next
            && linePtr === paragraphPtr?.data?.head.next
            && charPtr!.data === null) {
            deleteTextLog.editTextLog = new EditTextLog('');
            return null;
        }
        const prevRect = this.oolongText.getRect(this.editPosition.paragraphPtr!, this.editPosition.linePtr!.prev!);
        //******************************* 更新光标位置      ************************************/
        const textCharList: TextCharUnit[] = [];
        for (let i = 0; i < times; i++) {
            this.backSpaceLeftOne(textCharList);
        }
        deleteTextLog.editTextLog = EditTextLog.generateFrom(textCharList);
        //******************************* 绘制部分 ************************************/
        const nextRect = this.oolongText.reTypesetting(this.pageManager, this.editPosition);
        //******************************* 矫正光标 ************************************/

        this.updateEditPositionCursor();
        const rect = Rect.getRectBounds([prevRect, nextRect]);
        const redrawRectNode = Rect.rect2RectNode(rect);
        const visibleBounds = this.gmlRender.getViewPortBounds();
        const rectNode = InteractiveUtils.interactRect(visibleBounds, redrawRectNode);
        this._bufferBounds(rectNode, this.gmlRender.globalTransform.a / 2);

        const result = this.nodeManager.tree.search(rectNode);

        //整理需要重新绘制的对象
        renderManager.addDrawNode(this.oolongText);
        return rect;
    }

    moveUp(): TextCursorPosition {

        const paragraphPtr = this.editPosition.paragraphPtr;
        const linePtr = this.editPosition.linePtr;
        const charPtr = this.editPosition.charPtr;
        if (!paragraphPtr) {
            throw new Error("paragraphs数据错误");
        }
        if (!linePtr) {
            throw new Error("lines 数据错误");
        }
        if (!charPtr) {
            throw new Error("char 数据错误");
        }
        //******************************* 计算光标位置    ************************************/
        const cursorPoint = this.getCursorPosition();
        //******************************* 有上一行 ************************************/
        const prevLinePtr = linePtr.prev!;
        if (prevLinePtr.data !== null) {
            const res = prevLinePtr.data.detectX(cursorPoint.x);
            if (res === null) {
                throw new Error("数据计算错误");
            }
            // this.editPosition.linePtr = prevLinePtr;
            // this.editPosition.charPtr = res;
            // this.updateEditPositionCursor();
            return TextCursorPosition.load(paragraphPtr, prevLinePtr, charPtr);
        }
        //******************************* 所在段落没有上一行，但是有上一段落 ************************************/
        const prevParagraphPtr = paragraphPtr.prev!;
        if (prevParagraphPtr.data !== null) {
            const res = prevParagraphPtr.data!.tail.prev!.data!.detectX(cursorPoint.x);
            if (res === null) {
                throw new Error("数据计算错误");
            }
            return TextCursorPosition.load(prevParagraphPtr, prevParagraphPtr.data!.tail.prev!, res);
        }
        //******************************* 所在段落没有上一行，无上一段落************************************/
        return this.getEditPosition();
    }

    moveDown(): TextCursorPosition {
        const paragraphPtr = this.editPosition.paragraphPtr;
        const linePtr = this.editPosition.linePtr;
        const charPtr = this.editPosition.charPtr;
        if (!paragraphPtr) {
            throw new Error("paragraphs数据错误");
        }
        if (!linePtr) {
            throw new Error("lines 数据错误");
        }
        if (!charPtr) {
            throw new Error("char 数据错误");
        }
        //******************************* 计算光标位置    ************************************/
        const cursorPoint = this.getCursorPosition();
        //******************************* 有下一行 ************************************/
        const nextLinePtr = linePtr.next!;
        if (nextLinePtr.data !== null) {
            const res = nextLinePtr.data.detectX(cursorPoint.x);
            if (res === null) {
                throw new Error("数据计算错误");
            }
            return TextCursorPosition.load(paragraphPtr, nextLinePtr, res);
        }
        //******************************* 所在段落没有下一行，但是有下一段落 ************************************/
        const nextParagraphPtr = paragraphPtr.next!;
        if (nextParagraphPtr.data !== null) {
            const res = nextParagraphPtr.data!.head.next!.data!.detectX(cursorPoint.x);
            if (res === null) {
                throw new Error("数据计算错误");
            }
            return TextCursorPosition.load(nextParagraphPtr, nextParagraphPtr.data!.head.next!, res);

        }
        //******************************* 在行尾，但是所在段落没有下一行，且无下一段落 ************************************/
        return this.getEditPosition();
    }

    moveRight(): TextCursorPosition {
        const paragraphPtr = this.editPosition.paragraphPtr;
        const linePtr = this.editPosition.linePtr;
        const charPtr = this.editPosition.charPtr;
        if (!paragraphPtr) {
            throw new Error("paragraphs数据错误");
        }
        if (!linePtr) {
            throw new Error("lines 数据错误");
        }
        if (!charPtr) {
            throw new Error("char 数据错误");
        }
        //******************************* 更新光标位置      ************************************/
        const nextCharPtr = charPtr.next!;
        //******************************* 所在行后一位有字符 ************************************/
        if (nextCharPtr.data !== null) {
            return TextCursorPosition.load(paragraphPtr, linePtr, nextCharPtr);
        }
        //******************************* 在行尾，但是所在段落有下一行 ************************************/
        const nextLinePtr = linePtr.next!;
        if (nextLinePtr.data !== null) {
            return TextCursorPosition.load(paragraphPtr, nextLinePtr, nextLinePtr.data!.head.next!);
        }
        //******************************* 在行尾，但是所在段落没有下一行，但是有下一段落 ************************************/
        const nextParagraphPtr = paragraphPtr.next!;
        if (nextParagraphPtr.data !== null) {
            const cacheLinePtr = nextParagraphPtr.data!.head.next!;
            return TextCursorPosition.load(nextParagraphPtr, cacheLinePtr, cacheLinePtr.data!.head);
        }
        //******************************* 在行尾，但是所在段落没有下一行，且无下一段落 ************************************/
        return this.getEditPosition();
    }

    moveLeft(): TextCursorPosition {
        const paragraphPtr = this.editPosition.paragraphPtr;
        const linePtr = this.editPosition.linePtr;
        const charPtr = this.editPosition.charPtr;
        if (!paragraphPtr) {
            throw new Error("paragraphs数据错误");
        }
        if (!linePtr) {
            throw new Error("lines 数据错误");
        }
        if (!charPtr) {
            throw new Error("char 数据错误");
        }
        //******************************* 更新光标位置      ************************************/

        //******************************* 所在行前一位有字符 ************************************/
        if (charPtr.prev) {
            return TextCursorPosition.load(paragraphPtr, linePtr, charPtr.prev);
        }
        //******************************* 在行首，但是所在段落有上一行 ************************************/
        const prevLinePtr = linePtr.prev!;
        if (prevLinePtr.data !== null) {
            return TextCursorPosition.load(paragraphPtr, prevLinePtr, prevLinePtr.data!.tail.prev!.prev!);
        }
        //******************************* 在行首，并且所在段落没有上一行，但是有上一段落 ************************************/
        const prevParagraphPtr = paragraphPtr.prev!;
        if (prevParagraphPtr.data !== null) {
            const cacheLinePtr = prevParagraphPtr.data!.tail.prev!;
            return TextCursorPosition.load(prevParagraphPtr, cacheLinePtr, cacheLinePtr.data!.tail.prev!);
        }
        //******************************* 在行首并且并且所在段落没有上一行，没有上一段落 ************************************/
        return this.getEditPosition();
    }

    getCursorPosition(): Point {
        const charPtr = this.editPosition.charPtr!;
        if (charPtr.data) {
            const linePoint = charPtr.data.linePtr!.data!.globalPos();
            const charGlobalY = charPtr.data.y + linePoint.y;
            const charGlobalX = charPtr.data.width + charPtr.data.x + linePoint.x;
            return new Point(charGlobalX, charGlobalY);
        }
        const linePtr = this.editPosition.linePtr!.data!;
        const linePoint = linePtr!.globalPos();
        const charGlobalY = linePoint.y;
        const charGlobalX = linePoint.x;
        return new Point(charGlobalX, charGlobalY);
    }


    updateEditPositionCursor() {
        const point = this.getCursorPosition();
        this.renderInput?.updateCursor(
            new Point(point.x, point.y), this.gmlRender, this.editPosition.paragraphPtr!.data!.fontSize,
        );
    }

    _bufferBounds(bounds: RectNode, scale: number, buffer = 2) {
        bounds.minX = Math.round((bounds.minX) * scale - buffer) / scale;
        bounds.minY = Math.round((bounds.minY) * scale - buffer) / scale;
        bounds.maxX = Math.round((bounds.maxX) * scale + 2 * buffer) / scale;
        bounds.maxY = Math.round((bounds.maxY) * scale + 2 * buffer) / scale;
    }


}