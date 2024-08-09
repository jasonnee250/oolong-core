import {OolongParagraph} from "@/text/base/OolongParagraph";
import {GraphicNode, Point, RectNode, TextAlignType} from "dahongpao-core";
import {OolongLine} from "@/text/base/OolongLine";
import {
    DefaultFont,
    limitLineWidth,
    LineSpacing,
    ParagraphSpacing
} from "@/text/config/OolongTextConstants";
import {Rect} from "@/text/base/Rect.ts";
import {EditPositionInfo} from "@/text/base/EditPositionInfo.ts";
import {LinkNode} from "@/text/base/OolongLink.ts";
import {OolongCharacter} from "@/text/base/OolongCharacter.ts";
import {PageManager} from "@/page/PageManager.ts";
import {paddingTB} from "@/page/PageConfig.ts";
import {Page} from "@/page/Page.ts";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {TextListEnum} from "@/text/base/TextListInfo.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";

export class OolongText extends GraphicNode {

    head: LinkNode<OolongParagraph>;
    tail: LinkNode<OolongParagraph>;

    graphicContext: CanvasRenderingContext2D;

    limitWidth = limitLineWidth;

    type: string = OolongNodeType.Text;

    /** 文字属性补充 */
    bold: boolean = false;
    italic: boolean = false;
    parent: GraphicNode | null = null;

    toNodeId: string | null = null;

    /**
     *
     * @param id
     * @param ctx
     * @param startTextPos 相对page的坐标，如果不在page内，则为全局绝对坐标
     * @param page
     */
    constructor(id: string, ctx: CanvasRenderingContext2D, startTextPos: Point, page: Page | null = null) {
        super(id);
        this.graphicContext = ctx;
        this.x = startTextPos.x;
        this.y = startTextPos.y;
        this.head = LinkNode.generateLink<OolongParagraph>();
        this.tail = this.head.next!;
        const linkParagraph = new LinkNode<OolongParagraph>(new OolongParagraph(this));
        const textPos = new Point(startTextPos.x, startTextPos.y);
        this.parent = page;
        linkParagraph.data!.initLine(linkParagraph, textPos, page);
        this.head.add(linkParagraph);
        this.horizonAlign = TextAlignType.TOP_OR_LEFT;
        this.fontFamily = DefaultFont;
    }

    getNodeId():string{
        if(this.toNodeId){
            return this.toNodeId;
        }
        return this.id;
    }

    getGlobalPos(): Point {
        if (this.parent) {
            return new Point(this.x + this.parent.x, this.y + this.parent.y);
        }
        return new Point(this.x, this.y);
    }

    toString(): string {
        let res = "";

        let iter = this.head;
        while (iter.next && iter.next.data) {
            res += iter.next.data.toString();
            iter = iter.next;
        }
        return res;
    }

    hasText(): boolean {
        const line = this.head.next?.data?.head.next;
        if (line) {
            const lineStr = line.toString();
            if (lineStr.length > 0) {
                return true;
            }
        }
        return false;
    }

    getBounds():RectNode{
        return this.getRectNode();
    }

    getRectNode(): RectNode {
        const rectList: Rect[] = []
        let iter = this.head;
        while (iter.next && iter.next.data) {
            rectList.push(iter.next.data.getRect());
            iter = iter.next;
        }
        const resRect = Rect.getRectBounds(rectList);
        return {
            id: this.id,
            minX: resRect.x,
            minY: resRect.y,
            maxX: resRect.x + resRect.width,
            maxY: resRect.y + resRect.height,
        }
    }

    updatePos(pos: Point) {
        this.x = pos.x;
        this.y = pos.y;
        let pIter = this.head.next;
        while (pIter && pIter.data) {
            pIter.data.updatePos(pos);
            pos.y = pos.y + ParagraphSpacing;
            pIter = pIter.next;
        }
    }

    updateDeltaPos(dx: number, dy: number) {
        let pIter = this.head.next;
        while (pIter && pIter.data) {
            pIter.data.updateDeltaPos(dx, dy);
            pIter = pIter.next;
        }
    }

    updateFontSize(fontSize: number) {
        this.fontSize = fontSize;
        let pIter = this.head.next;
        while (pIter && pIter.data) {
            pIter.data.fontSize = fontSize;
            pIter.data.reTypeCharSize();
            pIter = pIter.next;
        }
    }

    updateHorizonAlign(horizonAlign: TextAlignType) {
        this.horizonAlign = horizonAlign;
        let pIter = this.head.next;
        while (pIter && pIter.data) {
            pIter.data.horizonAlign = horizonAlign;
            pIter = pIter.next;
        }
    }

    updateFontColor(fontColor: string) {
        this.fontColor = fontColor;
        const callBack = (c: OolongCharacter) => {
            if (c.color !== undefined) {
                c.color = fontColor;
            }
            return false;
        }
        this.traversalAll(callBack);
    }

    updateBold(bold: boolean) {
        this.bold = bold;
        const callBack = (c: OolongCharacter) => {
            if (c.bold !== undefined) {
                c.bold = bold;
            }
            return false;
        }
        this.traversalAll(callBack);
    }

    updateItalic(italic: boolean) {
        this.italic = italic;
        const callBack = (c: OolongCharacter) => {
            if (c.italic !== undefined) {
                c.italic = italic;
            }
            return false;
        }
        this.traversalAll(callBack);
    }

    /**
     * 可视区域范围内绘制，性能较好
     */
    drawVisible(rect: RectNode | Rect,ctx:CanvasRenderingContext2D=this.graphicContext): void {
        let rectMinY = 0;
        let rectMaxY = 0;
        if (rect instanceof Rect) {
            rectMinY = (rect as Rect).y;
            rectMaxY = (rect as Rect).y + (rect as Rect).height;
        } else {
            rectMinY = (rect as RectNode).minY;
            rectMaxY = (rect as RectNode).maxY;
        }
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const textFill = this.fontColor;
        const baseColor = textFill;
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = 1;

        let iter = this.head;
        while (iter.next && iter.next.data) {
            const paragraph = iter.next.data;
            const baseFontStyle = this.getFontDefine(paragraph.fontSize);
            ctx.font = baseFontStyle;
            let lineIter = paragraph.head.next;
            if (paragraph.listInfo.listType === TextListEnum.UnOrdered) {
                const lineGlobalPoint = lineIter!.data!.globalPos();
                ctx.fillStyle = "#1456f0";
                ctx.fillText("•", lineGlobalPoint.x - paragraph.fontSize, lineGlobalPoint.y);
                ctx.fillStyle = baseColor;
            } else if (paragraph.listInfo.listType === TextListEnum.Ordered) {
                const lineGlobalPoint = lineIter!.data!.globalPos();
                ctx.fillStyle = "#1456f0";
                const orderStr = paragraph.listInfo.orderNum + ".";
                const charWidth = ctx.measureText(orderStr).width + 3;
                const bufferWidth = charWidth;//charWidth+3>paragraph.fontSize?charWidth+3:paragraph.fontSize;
                ctx.fillText(orderStr, lineGlobalPoint.x - bufferWidth, lineGlobalPoint.y);
                ctx.fillStyle = baseColor;
            }
            while (lineIter && lineIter.data) {
                const line = lineIter.data;
                const lineGlobalPoint = line.globalPos();
                const x = lineGlobalPoint.x;
                const y = lineGlobalPoint.y;
                if (y < rectMinY) {
                    lineIter = lineIter.next;
                    continue;
                }
                if (y > rectMaxY) {
                    return;
                }
                line.draw(ctx, x, y, baseColor, baseFontStyle);
                lineIter = lineIter.next;
            }
            iter = iter.next;
        }
    }

    /**
     * 算法可以优化
     * @param point
     */
    detect(point: Point): EditPositionInfo {

        if (point.y < this.y) {
            return new EditPositionInfo(this.head.next, this.head.next!.data!.head.next, this.head.next!.data!.head.next!.data!.head);
        }

        let iter = this.head;
        while (iter.next && iter.next.data) {
            const paragraph = iter.next.data;
            const res = paragraph.detect(point);
            if (res !== null) {
                res.paragraphPtr = iter.next;
                return res;
            }
            iter = iter.next;
        }
        const lastLine = this.tail.prev!.data!.tail.prev!;

        return new EditPositionInfo(
            this.tail.prev,
            lastLine,
            lastLine.data!.tail.prev,
        );
    }

    getParagraphByIndex(pIndex: number): OolongParagraph | null {
        let para = this.head.next;
        while (para && para.data) {
            if (para.data.index === pIndex) {
                break;
            }
            para = para.next;
        }
        return para?.data || null;
    }

    modifyLinePosX(horizonAlign: TextAlignType, startX: number, lineWidth: number, contentWidth: number): number {
        if (horizonAlign === TextAlignType.TOP_OR_LEFT) {
            return startX;
        }
        if (horizonAlign === TextAlignType.CENTER) {
            const cache = 0.5 * (contentWidth - lineWidth);
            return startX + cache;
        }
        if (horizonAlign === TextAlignType.BOTTOM_OR_RIGHT) {
            const cache = contentWidth - lineWidth;
            return startX + cache;
        }
        return startX;
    }

    reTypesettingParagraph(pageManager: PageManager, editPosition: EditPositionInfo, nodePtr?: OolongNode): Rect {
        const paragraph = editPosition.paragraphPtr!;
        let startX = this.x;
        if (nodePtr && nodePtr.type===OolongNodeType.Shape) {
            startX = nodePtr.getTextContentRect().x;
        }
        const listInfo = paragraph.data!.listInfo;
        if (listInfo.listType === TextListEnum.UnOrdered) {
            startX = startX + paragraph.data!.fontSize * listInfo.levelNum;
        } else if (listInfo.listType === TextListEnum.Ordered) {
            const orderStr = paragraph.data!.listInfo.orderNum + ".";
            const baseFontStyle = this.getFontDefine(paragraph.data!.fontSize);
            this.graphicContext.font = baseFontStyle;
            const charWidth = this.graphicContext.measureText(orderStr).width + 3;
            startX = startX + charWidth * listInfo.levelNum;
        }
        const linePtr = editPosition.linePtr!;
        const lineHeight = this._getDefaultHeight(paragraph.data!.fontSize);
        let lineIndex = linePtr.data!.index;
        let newLine = new LinkNode(new OolongLine(paragraph, lineHeight));
        const headLink = newLine;
        newLine.data!.y = linePtr.data!.y;
        newLine.data!.x = linePtr.data!.x;
        newLine.data!.parent = linePtr.data!.parent;
        newLine.data!.index = lineIndex;
        newLine.data!.height = lineHeight;
        if (editPosition.charPtr && !editPosition.charPtr.data) {
            editPosition.charPtr = headLink.data!.head;
        }

        let sumWidth = 0;
        const originHead = linePtr.prev!;

        const contentWidth = this.limitWidth;

        let horizonAlignType = this.horizonAlign;
        if (paragraph.data!.horizonAlign !== undefined) {
            horizonAlignType = paragraph.data!.horizonAlign;
        }


        let lineIter: LinkNode<OolongLine> | null = linePtr;
        let charIndex = 0;
        while (lineIter && lineIter.data) {
            const line = lineIter.data;
            let charIter: LinkNode<OolongCharacter> | null = line.head.next;
            while (charIter && charIter.data) {
                const char = charIter.data;
                if (sumWidth + char.width > this.limitWidth) {
                    charIndex = 0;
                    lineIndex++;
                    //换行
                    const nextLine = new LinkNode<OolongLine>(new OolongLine(paragraph, lineHeight));
                    //根据align type矫正
                    const modifyPointX = this.modifyLinePosX(horizonAlignType, startX, newLine.data!.getWidth(), contentWidth);
                    newLine.data!.x = modifyPointX;
                    newLine.data!.y = newLine.data!.y;
                    newLine.add(nextLine);
                    nextLine.data!.index = lineIndex;
                    let y = newLine.data!.y + lineHeight + LineSpacing;
                    const x = startX;
                    const page = newLine.data!.parent;
                    if (page) {
                        if (y > page.h - paddingTB) {
                            y = paddingTB;
                            const nextPage = pageManager.findNextPage(page as Page);
                            nextLine.data!.parent = nextPage;
                        } else {
                            nextLine.data!.parent = page;
                        }
                    }

                    nextLine.data!.y = y;
                    nextLine.data!.x = x;
                    char.x = 0;
                    char.y = 0;
                    newLine = nextLine;
                } else {
                    //不换行
                    newLine.data!.height = lineHeight
                    char.x = sumWidth;
                }
                const charLinkNode = charIter;
                charLinkNode.data!.index = charIndex;
                charIndex++;
                charIter = charIter.next;
                newLine.data!.tail.prev?.add(charLinkNode);
                char.linePtr = newLine;
                sumWidth = char.x + char.width;
            }
            lineIter = lineIter.next;
        }

        linePtr.breakOff();
        originHead.pushAdd(headLink);
        editPosition.linePtr = headLink;
        newLine.pushAdd(paragraph.data!.tail);
        //防止未换行情况矫正
        const modifyPointX = this.modifyLinePosX(horizonAlignType, startX, newLine.data!.getWidth(), contentWidth);
        newLine.data!.x = modifyPointX;
        newLine.data!.y = newLine.data!.y;
        return paragraph.data!.getRect(originHead.next!);
    }

    reTypesetting(pageManager: PageManager, editPosition: EditPositionInfo, nodePtr?: OolongNode): Rect {
        const rects: Rect[] = [];
        let paragraphRect = this.reTypesettingParagraph(pageManager, editPosition, nodePtr);
        rects.push(paragraphRect);

        let pIndex = editPosition.paragraphPtr!.data!.index;

        let paragraphIter = editPosition.paragraphPtr!.next;
        while (paragraphIter && paragraphIter.data) {
            pIndex++;
            paragraphIter.data.index = pIndex;
            const paragraph = paragraphIter.data;
            const lastLine = paragraphIter.prev!.data!.tail.prev!.data!;
            const page = lastLine.parent;
            let y = lastLine.y + lastLine.height + ParagraphSpacing;
            if (page) {
                if (y > page.h - paddingTB) {
                    y = paddingTB;
                    const nextPage = pageManager.findNextPage(page as Page);
                    paragraph.head.next!.data!.parent = nextPage;
                } else {
                    paragraph.head.next!.data!.parent = page;
                }
            }
            paragraph.head.next!.data!.y = y
            const editPositionCache = new EditPositionInfo(paragraphIter, paragraphIter.data.head.next!, null);
            paragraphRect = this.reTypesettingParagraph(pageManager, editPositionCache, nodePtr);
            rects.push(paragraphRect);
            paragraphIter = paragraphIter.next;
        }
        const rect = Rect.getRectBounds(rects);
        return rect;
    }

    getRect(paragraphPtr: LinkNode<OolongParagraph>, linePtr: LinkNode<OolongLine> = paragraphPtr.data!.head!): Rect {
        const rects: Rect[] = [];
        let paragraphRect = paragraphPtr.data!.getRect(linePtr)!;
        rects.push(paragraphRect);
        let paragraphIter = paragraphPtr.next;
        while (paragraphIter && paragraphIter.data) {
            paragraphRect = paragraphIter.data.getRect();
            rects.push(paragraphRect);
            paragraphIter = paragraphIter.next;
        }
        const rect = Rect.getRectBounds(rects);
        return rect;
    }

    getTailTextCursorPosition(): TextCursorPosition {
        const tailPara = this.tail.prev!.data!;
        const tailLine = tailPara.tail.prev!.data!;
        return new TextCursorPosition(tailPara.index, tailLine.index, tailLine.tail.prev!.data!.index);
    }

    getHeadCursorPosition(): TextCursorPosition {
        return new TextCursorPosition(0, 0, -1);
    }

    _getDefaultHeight(fontSize: number): number {
        this.graphicContext.font = this.getFontDefine(fontSize);
        const result = this.graphicContext.measureText("1");
        const height = result.fontBoundingBoxAscent + result.fontBoundingBoxDescent;
        return height;
    }

    getFontDefine(fontSize: number): string {
        let cache = fontSize.toString() + 'px ' + this.fontFamily;
        if (this.bold) {
            cache = "900 " + cache;
        }
        if (this.italic) {
            cache = "italic " + cache;
        }
        return cache
    }

    serializeToInterval(startIndex: number, endIndex: number): OolongNodeDO {
        let iter = this.head.next;
        const paragraphs = [];
        let index = 0;
        while (iter && iter.data) {
            if (index < startIndex) {
                iter = iter.next;
                index++;
                continue;
            }
            if (index > endIndex) {
                break;
            }
            const paragraphDO = iter.data.serializeTo();
            paragraphs.push(paragraphDO);
            iter = iter.next;
            index++;
        }

        return {
            id: this.id,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            alpha: this.alpha,
            fontSize: this.fontSize,
            fontColor: this.fontColor,
            fontFamily: this.fontFamily,
            zIndex: this.zIndex,
            color: this.color,
            type: this.type,
            horizonAlign: this.horizonAlign,
            limitWidth: this.limitWidth,
            paragraphs,
            bold: this.bold,
            italic: this.italic,
            pageId: this.parent?.id,
        }
    }


    serializeTo(): OolongNodeDO {
        let iter = this.head.next;
        const paragraphs = [];
        while (iter && iter.data) {
            const paragraphDO = iter.data.serializeTo();
            paragraphs.push(paragraphDO);
            iter = iter.next;
        }

        return {
            id: this.id,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            alpha: this.alpha,
            fontSize: this.fontSize,
            fontColor: this.fontColor,
            fontFamily: this.fontFamily,
            zIndex: this.zIndex,
            color: this.color,
            type: this.type,
            horizonAlign: this.horizonAlign,
            limitWidth: this.limitWidth,
            paragraphs,
            bold: this.bold,
            italic: this.italic,
            pageId: this.parent?.id,
        }
    }

    static load(nodeDO: OolongNodeDO, ctx: CanvasRenderingContext2D, pageManager: PageManager): OolongText {
        const {
            id,
            pageId,
            horizonAlign,
            limitWidth,
            bold,
            italic,
            zIndex,
            alpha,
            fontColor,
            fontFamily,
            fontSize,
            x,
            y
        } = nodeDO;
        const startPoint = new Point(x, y);
        const oolongText = new OolongText(id, ctx, startPoint);
        let iter = oolongText.head;
        oolongText.zIndex = zIndex;
        oolongText.fontColor = fontColor;
        oolongText.fontSize = fontSize;
        oolongText.fontFamily = fontFamily;
        oolongText.alpha = alpha;
        oolongText.bold = bold || false;
        oolongText.italic = italic || false;
        oolongText.limitWidth = limitWidth!;
        oolongText.horizonAlign = horizonAlign;
        if (pageId) {
            oolongText.parent = pageManager.getPage(pageId);
        }
        for (const paragraphDO of nodeDO.paragraphs!) {
            const linkedParagraph = OolongParagraph.load(paragraphDO, oolongText, pageManager);
            iter.next = linkedParagraph;
            linkedParagraph.prev = iter;
            iter = linkedParagraph;
        }
        iter.next = oolongText.tail;
        oolongText.tail.prev = iter;
        return oolongText;
    }

    getPositionPtrFromCursorPosition(textCursorPosition: TextCursorPosition) {
        const positionPtr = new EditPositionInfo(this.head.next, null, null);
        const {paragraphIndex, lineIndex, charIndex} = textCursorPosition;
        let pIter = this.head.next;
        let i = 0;
        let pFlag = false;
        let lFlag = false;
        let cFlag = false;
        while (pIter && pIter.data) {
            if (paragraphIndex === i) {
                positionPtr.paragraphPtr = pIter;
                pFlag = true;
                break;
            }
            pIter = pIter.next;
            i++;
        }
        let lIter = positionPtr.paragraphPtr!.data!.head!.next;
        i = 0;
        while (lIter && lIter.data) {
            if (i === lineIndex) {
                lFlag = true;
                positionPtr.linePtr = lIter;
            }
            lIter = lIter.next;
            i++;
        }
        let charIter = positionPtr.linePtr?.data!.head || null;
        if (charIndex < 0) {
            positionPtr.charPtr = charIter;
            cFlag = true;
        } else {
            charIter = charIter!.next;
            i = 0;
            while (charIter && charIter.data) {
                if (i === charIndex) {
                    cFlag = true;
                    positionPtr.charPtr = charIter;
                }
                charIter = charIter.next;
                i++;
            }
        }
        const succ = pFlag && lFlag && cFlag;
        if (!succ) {
            console.error("光标位置索引出错！，已兜底处理");
        }
        return positionPtr;
    }

    traversalAll(callBack: (char: OolongCharacter) => boolean): boolean {
        let cachePtr = this.head.next;
        while (cachePtr && cachePtr.data) {
            const res = cachePtr.data.traversal(callBack);
            if (res) {
                return true;
            }
            cachePtr = cachePtr.next;
        }
        return false;
    }


    traversal(startPos: EditPositionInfo, endPos: EditPositionInfo, callBack: (char: OolongCharacter) => boolean) {
        const originPIter = startPos.paragraphPtr!;
        const originLineIter = startPos.linePtr!;
        const originCharIter = startPos.charPtr!;

        const curPIter = endPos.paragraphPtr!;
        const curLineIter = endPos.linePtr!;
        const curCharIter = endPos.charPtr!;

        /** 相同段落+相同行 */
        if (originPIter === curPIter && originLineIter === curLineIter) {
            originLineIter.data!.traversal(originCharIter, curCharIter, callBack);
        }
        /** 相同段落+不同行 */
        if (originPIter === curPIter && originLineIter !== curLineIter) {
            originLineIter.data!.traversal(originCharIter, originLineIter.data!.tail, callBack);
            let iter = originLineIter.next;
            while (iter && iter.data && iter != curLineIter) {
                iter.data!.traversal(iter.data.head, iter.data.tail, callBack);
                iter = iter.next;
            }
            curLineIter.data!.traversal(curLineIter.data!.head, curCharIter, callBack);
        }
        /** 不同段落 */
        if (originPIter !== curPIter) {
            /** A段落 */
            //首行
            originLineIter.data!.traversal(originCharIter, originLineIter.data!.tail, callBack);
            //到最后一行
            {
                let iter = originLineIter.next;
                while (iter && iter.data) {
                    iter.data!.traversal(iter.data.head, iter.data.tail, callBack);
                    iter = iter.next;
                }
            }
            /** 中间段落 */
            let cachePtr = originPIter.next;
            while (cachePtr && cachePtr.data && cachePtr !== curPIter) {
                let iter = cachePtr.data!.head.next;
                while (iter && iter.data) {
                    iter.data!.traversal(iter.data.head, iter.data.tail, callBack);
                    iter = iter.next;
                }
                cachePtr = cachePtr.next;
            }
            /** B段落 */
            //到最后一行前一行
            {
                let iter = curPIter.data!.head.next;
                while (iter && iter.data && iter !== curLineIter) {
                    iter.data!.traversal(iter.data.head, iter.data.tail, callBack);
                    iter = iter.next;
                }
                curLineIter.data!.traversal(curLineIter.data!.head, curCharIter, callBack);
            }
        }
    }

    traversalParagraph(callBack: (para: OolongParagraph) => void) {
        let ptr = this.head.next;
        while (ptr && ptr.data) {
            callBack(ptr.data);
            ptr = ptr.next;
        }
    }
}