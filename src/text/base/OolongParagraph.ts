import {OolongLine} from "@/text/base/OolongLine";
import {Rect} from "@/text/base/Rect.ts";
import {Point, TextAlignType} from "dahongpao-core";
import {OolongText} from "@/text/base/OolongText.ts";
import {LinkNode} from "@/text/base/OolongLink.ts";
import {EditPositionInfo} from "@/text/base/EditPositionInfo.ts";
import {OolongCharacter} from "@/text/base/OolongCharacter.ts";
import {Page} from "@/page/Page.ts";
import {OolongParagraphDO} from "@/file/text/OolongParagraphDO.ts";
import {OolongLineDO} from "@/file/text/OolongLineDO.ts";
import {PageManager} from "@/page/PageManager.ts";
import {LineSpacing} from "@/text/config/OolongTextConstants.ts";
import {TextListEnum, TextListInfo} from "@/text/base/TextListInfo.ts";

export class OolongParagraph {
    //段落的位置，相对于文本块的

    head: LinkNode<OolongLine>;
    tail: LinkNode<OolongLine>;

    index: number = 0;
    //段落有自己的fontSize
    fontSize: number;
    textPtr: OolongText;

    listInfo:TextListInfo={listType:TextListEnum.None,levelNum:0,orderNum:0}

    horizonAlign?:TextAlignType;

    constructor(textPtr: OolongText) {
        this.textPtr = textPtr;
        this.fontSize = textPtr.fontSize;
        this.head = LinkNode.generateLink<OolongLine>();
        this.tail = this.head.next!;
    }

    updatePos(pos:Point){
        let lineIter=this.head.next;
        while (lineIter && lineIter.data){
            lineIter.data.x=pos.x;
            lineIter.data.y=pos.y;
            pos.y=pos.y+lineIter.data!.height+LineSpacing;
            lineIter=lineIter.next;
        }

    }

    updateDeltaPos(dx:number,dy:number){
        let lineIter=this.head.next;
        while (lineIter && lineIter.data){
            lineIter.data.x+=dx;
            lineIter.data.y+=dy;
            lineIter=lineIter.next;
        }

    }

    initLine(paragraphPtr: LinkNode<OolongParagraph>, startPos: Point, page: Page | null = null) {
        const defaultLineHeight = this.textPtr._getDefaultHeight(this.fontSize);
        const line = new OolongLine(paragraphPtr, defaultLineHeight);
        line.x = startPos.x;
        line.y = startPos.y;
        line.parent = page;
        this.head.add(new LinkNode<OolongLine>(line));
    }

    toString(): string {
        let res = "";
        let iter = this.head;
        while (iter.next && iter.next.data) {
            res += iter.next.data.toString();
            iter = iter.next;
        }
        res = res + "\n";
        return res;
    }

    size(): number {
        let iter = this.head;
        let i = 0;
        while (iter.next && iter.next.data) {
            i = i + iter.next.data.size();
            iter = iter.next;
        }
        return i;
    }

    getCharRect(start: LinkNode<OolongLine>,end:LinkNode<OolongLine>):Rect[]{
        const rectList: Rect[] = [];
        let iter: LinkNode<OolongLine> | null = start;
        if(!iter.data){
            iter=iter.next;
        }
        while (iter && iter.data) {
            rectList.push(iter.data.getCharRect(iter.data!.head,iter.data!.tail));
            if(iter===end){
                break;
            }
            iter = iter.next;
        }
        return rectList;
    }

    getRect(linePtr: LinkNode<OolongLine> = this.head): Rect {

        const rectList: Rect[] = [];
        let iter: LinkNode<OolongLine> | null = linePtr;
        if (iter.data === null && iter.next !== null) {
            iter = iter.next;
        }
        while (iter && iter.data) {
            const rect=iter.data.getRect();
            rectList.push(rect);
            iter = iter.next;
        }
        const x=this.textPtr.x;
        const headRect=rectList[0];
        rectList.push(new Rect(x,headRect.y,headRect.width,headRect.height));
        const rect = Rect.getRectBounds(rectList);
        return rect;
    }

    iterCharCallBack(charPtr: LinkNode<OolongCharacter>, linePtr: LinkNode<OolongLine>, cb: (char: LinkNode<OolongCharacter>) => void) {
        let charIter: LinkNode<OolongCharacter> | null = charPtr;
        //传入head进行矫正
        if (charIter.data === null && charIter.next !== null) {
            charIter = charIter.next;
        }
        linePtr.data?.iterCharCallBack(charIter, cb);
        let lineIter = linePtr.next;
        while (lineIter && lineIter.data) {
            lineIter.data.iterCharCallBack(lineIter.data.head, cb);
            lineIter = lineIter.next;
        }
    }

    detect(point: Point): EditPositionInfo | null {
        let iter = this.head;
        while (iter.next && iter.next.data) {
            const isTail=iter.next.next===this.tail;
            const res = iter.next.data.detect(point,isTail);
            if (res !== null) {
                return new EditPositionInfo(null, iter.next, res);
            }
            iter = iter.next;
        }
        return null;
    }

    back(): LinkNode<OolongLine> {
        return this.tail.prev!;
    }

    first(): LinkNode<OolongLine> {
        return this.head.next!;
    }

    traversal(callBack: (char: OolongCharacter) => boolean):boolean{
        let ptr=this.head.next;
        while (ptr && ptr.data) {
            const res=ptr.data.traversal(ptr.data.head!,ptr.data.tail!,callBack);
            if(res){
                return true;
            }
            ptr=ptr.next;
        }
        return false;
    }

    serializeToInterval(startIndex:number,endIndex:number):OolongParagraphDO{
        const lines: OolongLineDO[] = [];
        let iter = this.head.next;
        let index=0;
        while (iter && iter.data) {
            if(index<startIndex){
                iter = iter.next;
                index++;
                continue;
            }
            if(index>endIndex){
                break;
            }
            const lineDO = iter.data.serializeTo();
            lines.push(lineDO);
            iter = iter.next;
            index++;
        }
        return {
            lines: lines,
            index: this.index,
            fontSize: this.fontSize,
            listInfo:this.listInfo,
            horizonAlign:this.horizonAlign,
        }
    }

    serializeTo(): OolongParagraphDO {
        const lines: OolongLineDO[] = [];
        let iter = this.head.next;
        while (iter && iter.data) {
            const lineDO = iter.data.serializeTo();
            lines.push(lineDO);
            iter = iter.next;
        }
        return {
            lines: lines,
            index: this.index,
            fontSize: this.fontSize,
            listInfo:this.listInfo,
            horizonAlign:this.horizonAlign,
        }
    }

    static load(paragraphDO: OolongParagraphDO, textPtr: OolongText, pageManager: PageManager): LinkNode<OolongParagraph> {
        const paragraph = new OolongParagraph(textPtr);
        paragraph.index = paragraphDO.index;
        paragraph.fontSize = paragraphDO.fontSize || textPtr.fontSize;
        paragraph.listInfo=paragraphDO.listInfo||{listType:TextListEnum.None,levelNum:0};
        paragraph.horizonAlign=paragraphDO.horizonAlign;
        const linkParagraph = new LinkNode(paragraph);
        let iter = linkParagraph.data!.head;
        for (const lineDO of paragraphDO.lines) {
            const pageId = lineDO.parent;
            const page = pageManager.getPage(pageId);
            const linkedLine = OolongLine.load(lineDO, linkParagraph, page);
            iter.next = linkedLine;
            linkedLine.prev = iter;
            iter = linkedLine;
        }
        iter.next = linkParagraph.data!.tail;
        linkParagraph.data!.tail.prev = iter;

        return linkParagraph;
    }


    reTypeCharSize(): void {
        let lineIter = this.head.next;
        const glCtx=this.textPtr.graphicContext;
        glCtx.font=this.fontSize.toString() + 'px ' + this.textPtr.fontFamily;
        while (lineIter && lineIter.data) {

            const line = lineIter.data;
            let charIter = line.head.next;
            while (charIter && charIter.data) {
                const result = glCtx.measureText(charIter.data.charText);
                const height = result.fontBoundingBoxAscent + result.fontBoundingBoxDescent;
                const width = result.width;
                charIter.data.width = width;
                charIter.data.height = height;
                charIter = charIter.next;
            }
            lineIter = lineIter.next;
        }
        glCtx.font=this.textPtr.fontSize.toString() + 'px ' + this.textPtr.fontFamily;


    }

}