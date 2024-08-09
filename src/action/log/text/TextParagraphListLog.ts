import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {ParaListInfo} from "@/text/base/TextListInfo";

export class TextParagraphListLog implements IActionLog {
    type: ActionType=ActionType.TextParagraphList;
    reverseLog:TextParagraphListLog|null=null;


    nodeId:string;
    paraListInfoList:ParaListInfo[];

    constructor(nodeId:string,paraListInfoList:ParaListInfo[]) {
        this.nodeId=nodeId;
        this.paraListInfoList=paraListInfoList;
    }
    reverse(): IActionLog {
        if(!this.reverseLog){
            throw new Error("数据错误！");
        }
        return this.reverseLog;
    }
    clone(): IActionLog {
        return new TextParagraphListLog(this.nodeId,this.paraListInfoList);
    }

}