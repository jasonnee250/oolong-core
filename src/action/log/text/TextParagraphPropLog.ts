import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {TextAlignType} from "dahongpao-core";

export class TextParagraphPropLog implements IActionLog {

    nodeId:string;
    paragraphIndex:number;
    fontSize?:number;
    horizonAlign?:TextAlignType;

    constructor(nodeId:string,pIndex:number,fontSize?:number,horizonAlign?:TextAlignType) {
        this.nodeId=nodeId;
        this.paragraphIndex=pIndex;
        this.fontSize=fontSize;
        this.horizonAlign=horizonAlign;
    }

    type: ActionType=ActionType.TextParagraphProp;
    reverseLog:TextParagraphPropLog|null=null;
    reverse(): IActionLog {
        if(!this.reverseLog){
            throw new Error("数据错误！");
        }
        return this.reverseLog;
    }
    clone(): IActionLog {
        return new TextParagraphPropLog(this.nodeId,this.paragraphIndex,this.fontSize,this.horizonAlign);
    }

}