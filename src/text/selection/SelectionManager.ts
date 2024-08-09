import {Rect} from "@/text/base/Rect";
import {OolongText} from "@/text/base/OolongText";
import {EditPositionInfo} from "@/text/base/EditPositionInfo";
import {GMLRender} from "dahongpao-core";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {SelectViewProps} from "@/select/view/SelectViewProps.ts";
import {OolongCharacter} from "@/text/base/OolongCharacter.ts";

export class SelectionManager {

    selectionList: Rect[] = [];
    gmlRender: GMLRender;

    text:OolongText|null=null;
    start:TextCursorPosition|null=null;
    end:TextCursorPosition|null=null;

    constructor(render: GMLRender) {
        this.gmlRender = render;
    }

    clear():void{
        this.selectionList=[];
        this.start=null;
        this.end=null;
        this.text=null;
    }

    generateViewProps():SelectViewProps{
        let bold=false;
        let italic=false;
        const underline=false;
        const textThroughLine=false;
        let fontColor="";
        const fontBackgroundColor="";
        let fontSize=this.text!.fontSize;
        const charCallback=(char:OolongCharacter)=>{
            if(!bold && char.bold){
                bold=true;
            }
            if(!italic && char.italic){
                italic=true;
            }
            if(fontColor!=="mixed"){
                const charColor=char.color?char.color:this.text!.fontColor;
                if(fontColor===""){
                   fontColor=charColor;
                }else if(fontColor!==charColor){
                    fontColor="mixed";
                }
            }
            const paraFontSize=char.linePtr!.data!.paragraphPtr!.data!.fontSize;
            if(fontSize!==paraFontSize){
                fontSize=paraFontSize;
            }
            return false;
        }
        const startPos=this.text!.getPositionPtrFromCursorPosition(this.start!);
        const endPos=this.text!.getPositionPtrFromCursorPosition(this.end!);
        this.text!.traversal(startPos,endPos,charCallback);

        const viewProps= {} as SelectViewProps;
        viewProps.bold=bold;
        viewProps.fontColor=fontColor;
        viewProps.italic=italic;
        viewProps.underline=underline;
        viewProps.strikeThrough=textThroughLine;
        viewProps.fontBackgroundColor=fontBackgroundColor;
        viewProps.fontSize=fontSize;
        viewProps.hasText=true;
        return viewProps;
    }

    generateSelect(text: OolongText, originEditPosition: EditPositionInfo, currentEditPosition: EditPositionInfo):Rect[] {

        let startPos:EditPositionInfo;
        let endPos:EditPositionInfo;
        if(currentEditPosition.compare(originEditPosition)){
            startPos=originEditPosition;
            endPos=currentEditPosition;
        }else{
            endPos=originEditPosition;
            startPos=currentEditPosition;
        }
        this.text=text;
        this.start=startPos.serializeTo();
        this.end=endPos.serializeTo();

        return this.baseGenerateSelect(startPos,endPos);
    }

    reGenerateSelect(){
        if(!this.text){
            //无选区情况下
            return;
        }
        const startPos=this.text!.getPositionPtrFromCursorPosition(this.start!);
        const endPos=this.text!.getPositionPtrFromCursorPosition(this.end!);
        this.baseGenerateSelect(startPos,endPos);
    }

    baseGenerateSelect(startPos: EditPositionInfo, endPos: EditPositionInfo){
        const rectList: Rect[] = [];
        const originPIter = startPos.paragraphPtr!;
        const originLineIter = startPos.linePtr!;
        const originCharIter = startPos.charPtr!;

        const curPIter = endPos.paragraphPtr!;
        const curLineIter = endPos.linePtr!;
        const curCharIter = endPos.charPtr!;

        /** 相同段落+相同行 */
        if (originPIter === curPIter && originLineIter === curLineIter) {
            const rect=originLineIter.data!.getCharRect(originCharIter, curCharIter);
            rectList.push(rect);
            this.selectionList = rectList;
            return rectList;
        }
        /** 相同段落+不同行 */
        if (originPIter === curPIter && originLineIter !== curLineIter) {
            rectList.push(originLineIter.data!.getCharRect(originCharIter,originLineIter.data!.tail));
            if (originLineIter.data!.index + 1 < curLineIter.data!.index) {
                rectList.push(...originPIter.data!.getCharRect(originLineIter.next!, curLineIter.prev!));
            }
            rectList.push(curLineIter.data!.getCharRect(curLineIter.data!.head, curCharIter));
            this.selectionList = rectList;
            return rectList;
        }
        /** 不同段落 */
        if (originPIter !== curPIter) {
            //A段落首行
            rectList.push(originLineIter.data!.getCharRect(originCharIter,originLineIter.data!.tail));
            //A段落到最后前一行
            const lastLinePtr=originPIter.data!.tail.prev!;
            if(originLineIter.next!==originPIter.data!.tail && originLineIter.next!==lastLinePtr){
                rectList.push(...originPIter.data!.getCharRect(originLineIter.next!, lastLinePtr.prev!));
            }
            //A段落最后一行
            if(originLineIter.next!==originPIter.data!.tail){
                rectList.push(lastLinePtr.data!.getCharRect(lastLinePtr.data!.head,lastLinePtr.data!.tail));
            }
            //中间段落
            let cachePtr=originPIter.next;
            while (cachePtr && cachePtr.data && cachePtr!=curPIter){
                const cacheLastLinePtr=cachePtr.data!.tail.prev!;
                if(cachePtr.data!.head.next!==cacheLastLinePtr){
                    rectList.push(...originPIter.data!.getCharRect(cachePtr.data!.head, cacheLastLinePtr.prev!));
                }
                rectList.push(cacheLastLinePtr.data!.getCharRect(cacheLastLinePtr.data!.head,cacheLastLinePtr.data!.tail));
                cachePtr=cachePtr.next;
            }
            //B段落
            if(curPIter.data!.head.next !== curLineIter){
                rectList.push(...curPIter.data!.getCharRect(curPIter.data!.head, curLineIter.prev!));
            }
            rectList.push(curLineIter.data!.getCharRect(curLineIter.data!.head,curCharIter));
            this.selectionList = rectList;
            return rectList;
        }
        return [];
    }

}