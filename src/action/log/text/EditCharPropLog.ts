import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {TextCursorPosition} from "@/text/base/TextCursorPosition";

export interface CharPropInfo{
    color?:string;
    bold?:boolean;
    italic?:boolean;
    bgColor?:string;
    strikeThrough?:boolean,
    underline?:boolean,
}
export class EditCharPropLog implements IActionLog {

    nodeId:string;
    start:TextCursorPosition;
    end:TextCursorPosition;
    //字体颜色
    charPropInfo:CharPropInfo;

    type: ActionType=ActionType.EditCharProp;
    reverseLog:EditCharPropLog|null=null;

    constructor(nodeId:string,start:TextCursorPosition,end:TextCursorPosition,
                charPropInfo:CharPropInfo) {
        this.nodeId=nodeId;
        this.start=start;
        this.end=end;
        this.charPropInfo=charPropInfo;
    }
    reverse(): IActionLog {
        if(!this.reverseLog){
            throw new Error("数据错误！");
        }
        return this.reverseLog;
    }
    clone(): IActionLog {
        return new EditCharPropLog(this.nodeId,this.start,this.end,this.charPropInfo);
    }

}