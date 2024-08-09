import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {AddLinkLog, LinkEndType} from "@/action/log/line/AddLinkLog";

export class RemoveLinkLog implements IActionLog {
    type: ActionType=ActionType.RemoveLink;
    reverseLog:AddLinkLog|null=null;
    lineId:string;
    linkType:LinkEndType;

    constructor(lineId:string,linkType:LinkEndType) {
        this.lineId=lineId;
        this.linkType=linkType;
    }
    reverse(): IActionLog {
        if(!this.reverseLog){
            throw new Error("数据错误！");
        }
        return this.reverseLog;    }
    clone(): IActionLog {
        return new RemoveLinkLog(this.lineId,this.linkType);
    }

}