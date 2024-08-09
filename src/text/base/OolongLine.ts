import {CharInfo, OolongCharacter} from "@/text/base/OolongCharacter";
import {Rect} from "@/text/base/Rect.ts";
import {Point} from "dahongpao-core";
import {OolongParagraph} from "@/text/base/OolongParagraph.ts";
import {LinkNode} from "@/text/base/OolongLink.ts";
import {CanvasGraphicNode} from "dahongpao-canvas";
import {OolongLineDO} from "@/file/text/OolongLineDO.ts";
import {Page} from "@/page/Page.ts";
import {LineSpacing, ParagraphSpacing} from "@/text/config/OolongTextConstants.ts";

export class OolongLine {
    //绝对位置坐标
    x: number = 0;
    y: number = 0;
    height: number = 0;
    index: number = 0;
    head: LinkNode<OolongCharacter>;
    tail: LinkNode<OolongCharacter>;

    parent: CanvasGraphicNode | null = null;

    paragraphPtr: LinkNode<OolongParagraph> | null = null;

    constructor(paragraphPtr: LinkNode<OolongParagraph>, height: number) {
        this.head = LinkNode.generateLink<OolongCharacter>();
        this.tail = this.head.next!;
        this.height = height;
        this.paragraphPtr = paragraphPtr;
    }

    iterCharCallBack(charPtr: LinkNode<OolongCharacter>, cb: (char: LinkNode<OolongCharacter>) => void) {
        let charIter: LinkNode<OolongCharacter> | null = charPtr;
        //传入head进行矫正
        if (charIter.data === null && charIter.next !== null) {
            charIter = charIter.next;
        }
        while (charIter && charIter.data) {
            cb(charIter);
            charIter = charIter.next;
        }
    }

    draw(glCtx: CanvasRenderingContext2D, x: number, y: number, baseColor: string, baseFontStyle: string) {
        let stringBuilder = '';
        let iter = this.head;
        let charDraw = false;
        const charList: CharInfo[] = [];
        const delta = 0.5 * (this.height - this.paragraphPtr!.data!.fontSize);
        const posY = y - delta;
        while (iter.next && iter.next.data) {
            const charData = iter.next.data;

            const charInfo: CharInfo = {x: x + charData.x, y: y + charData.y,rectY:posY+charData.y, text: charData.charText,
                width:charData.width,height:charData.height};
            if (!charDraw) {
                if (charData.color !== undefined) {
                    charDraw = true;
                }
                if (charData.bold !== undefined) {
                    charDraw = true;

                }
                if (charData.italic !== undefined) {
                    charDraw = true;
                }
                if (charData.backgroundColor !== undefined) {
                    charDraw = true;
                }
                if (charData.underline !== undefined) {
                    charDraw = true;
                }
                if (charData.strikeThrough !== undefined) {
                    charDraw = true;
                }
            }
            charInfo.color = charData.color;
            charInfo.bold = charData.bold;
            charInfo.italic = charData.italic;
            charInfo.backgroundColor=charData.backgroundColor;
            charInfo.strikeThrough=charData.strikeThrough;
            charInfo.underline=charData.underline;
            charList.push(charInfo)
            stringBuilder += charData.charText;
            iter = iter.next;
        }
        if (!charDraw) {
            glCtx.fillText(stringBuilder, x, y);
        } else {
            const font = baseFontStyle;

            let cacheFont;
            for (const charInfo of charList) {
                cacheFont = font;
                if (charInfo.color) {
                    glCtx.fillStyle = charInfo.color;
                } else {
                    glCtx.fillStyle = baseColor;
                }
                if (charInfo.bold) {
                    cacheFont = "900 " + cacheFont;
                }
                if (charInfo.italic) {
                    cacheFont = "italic " + cacheFont;
                }
                if(charInfo.backgroundColor){
                    glCtx.save();
                    glCtx.fillStyle=charInfo.backgroundColor;
                    glCtx.fillRect(charInfo.x,charInfo.rectY,charInfo.width,charInfo.height);
                    glCtx.restore()
                }
                if(charInfo.underline){
                    glCtx.save();
                    glCtx.strokeStyle = "#000000";
                    glCtx.lineWidth = 1;
                    glCtx.moveTo(charInfo.x,charInfo.y+charInfo.height-2*delta);
                    glCtx.lineTo(charInfo.x+charInfo.width,charInfo.y+charInfo.height-2*delta);
                    glCtx.stroke();
                    glCtx.restore()
                }
                glCtx.font = cacheFont;
                glCtx.fillText(charInfo.text, charInfo.x, charInfo.y);
                if(charInfo.strikeThrough){
                    glCtx.save();
                    glCtx.strokeStyle = "#000000";
                    glCtx.lineWidth = 1;
                    glCtx.moveTo(charInfo.x,charInfo.rectY+0.5*(charInfo.height));
                    glCtx.lineTo(charInfo.x+charInfo.width,charInfo.rectY+0.5*(charInfo.height));
                    glCtx.stroke();
                    glCtx.restore()
                }




            }
            glCtx.font = font;
            glCtx.fillStyle = baseColor;
        }

    }

    toString(): string {
        let res = '';
        let iter = this.head;
        while (iter.next && iter.next.data) {
            res += iter.next.data.charText;
            iter = iter.next;
        }
        return res;
    }

    size(): number {
        let iter = this.head.next;
        let i = 0;
        while (iter && iter.data) {
            i++;
            iter = iter.next;
        }
        return i;
    }

    getCharRect(start: LinkNode<OolongCharacter>, end: LinkNode<OolongCharacter>): Rect {
        const globalPoint = this.globalPos();
        if (start === end) {
            return {
                x: globalPoint.x,
                y: globalPoint.y,
                width: 0,
                height: this.height,
            }
        }
        let width: number = 0
        let iter = start.next!;
        globalPoint.x += iter.data?.x || 0;
        const delta = 0.5 * (this.height - this.paragraphPtr!.data!.fontSize);
        globalPoint.y = globalPoint.y - delta;
        while (iter && iter.data) {
            width += iter.data.width;
            if (iter === end) {
                break;
            }
            iter = iter.next!;
        }
        return {
            x: globalPoint.x,
            y: globalPoint.y,
            width,
            height: this.height,
        }
    }

    getRect(): Rect {
        let width: number = 0
        let iter = this.head;
        while (iter.next && iter.next.data) {
            width += iter.next.data.width;
            iter = iter.next;
        }
        const globalPoint = this.globalPos();
        return {
            x: globalPoint.x,
            y: globalPoint.y,
            width,
            height: this.height,
        }
    }

    globalPos(): Point {
        if (this.parent) {
            return new Point(this.x + this.parent.x,
                this.y + this.parent.y
            );
        }
        return new Point(this.x, this.y);
    }

    transformToLocal(globalPoint: Point): Point {
        const gPoint = this.globalPos();
        return new Point(globalPoint.x - gPoint.x, globalPoint.y - gPoint.y);
    }

    detect(globalPoint: Point, isTail: boolean = false): LinkNode<OolongCharacter> | null {
        const point = this.transformToLocal(globalPoint);
        const buffer = isTail ? ParagraphSpacing : LineSpacing;
        if (point.y >= 0 && point.y <= this.height + buffer) {

            if (this.head.next === this.tail) {
                return this.head;
            }

            let iter = this.head.next!;
            let p = 0;
            let q = 0.5 * iter.data!.width;
            if (point.x < q) {
                return this.head;
            }

            while (iter.next && iter.next.data) {
                p = q;
                q = q + 0.5 * iter.data!.width + 0.5 * iter.next.data.width;
                if (point.x > p && point.x < q) {
                    return iter;
                }
                iter = iter.next;
            }
            return this.tail.prev;
        }
        return null;
    }

    detectX(globalX: number): LinkNode<OolongCharacter> | null {
        let x = globalX;
        if (this.parent) {
            x = x - this.parent.x;
        }
        let iter = this.head;
        if (Math.abs(x - this.x) < 1e-3) {
            return this.head;
        }
        while (iter.next && iter.next.data) {
            if (x >= this.x + iter.next.data.x && x <= this.x + iter.next.data.x + iter.next.data.width) {
                return iter.next;
            }
            iter = iter.next;
        }
        return this.tail.prev;
    }

    getWidth(): number {
        let charIter = this.head.next;
        let sum = 0;
        while (charIter && charIter.data) {
            sum = sum + charIter.data.width;
            charIter = charIter.next;
        }
        return sum;
    }

    back(): LinkNode<OolongCharacter> {
        return this.tail.prev!;
    }

    first(): LinkNode<OolongCharacter> {
        return this.head.next!;
    }

    serializeToInterval(startIndex: number, endIndex: number | null): OolongLineDO {
        const charDOList = [];
        let iter = this.head.next;
        let index = 0;
        while (iter && iter.data) {
            if (index < startIndex) {
                iter = iter.next;
                index++;
                continue;
            }
            if (endIndex !== null && index > endIndex) {
                break;
            }
            const charDO = iter.data.serializeTo();
            charDOList.push(charDO);
            iter = iter.next;
            index++;
        }


        return {
            x: this.x,
            y: this.y,
            index: this.index,
            height: this.height,
            charList: charDOList,
            parent: this.parent?.id || '',
        }
    }

    serializeTo(): OolongLineDO {
        const charDOList = [];
        let iter = this.head.next;
        while (iter && iter.data) {
            const charDO = iter.data.serializeTo();
            charDOList.push(charDO);
            iter = iter.next;
        }


        return {
            x: this.x,
            y: this.y,
            index: this.index,
            height: this.height,
            charList: charDOList,
            parent: this.parent?.id || '',
        }
    }

    static load(lineDO: OolongLineDO, paragraphPtr: LinkNode<OolongParagraph>, parent: Page | null): LinkNode<OolongLine> {
        const {x, y, height, index} = lineDO;
        const line = new OolongLine(paragraphPtr, height);
        line.x = x;
        line.y = y;
        line.parent = parent;
        let iter = line.head;
        const linkLine = new LinkNode(line);
        for (const charDO of lineDO.charList) {
            const character = OolongCharacter.load(charDO);
            const linkCharacter = new LinkNode(character);
            character.initChar(linkLine, linkCharacter)
            iter.next = linkCharacter;
            linkCharacter.prev = iter;
            iter = linkCharacter;
        }
        iter.next = line.tail;
        line.tail.prev = iter;
        line.index = index;

        return linkLine;
    }


    traversal(start: LinkNode<OolongCharacter>, end: LinkNode<OolongCharacter>, callBack: (char: OolongCharacter) => boolean): boolean {

        let iter = start.next!;
        while (iter && iter.data) {
            const char = iter.data;
            const res=callBack(char);
            if(res){
                return true;
            }
            if (iter === end) {
                break;
            }
            iter = iter.next!;
        }
        return false;

    }


}