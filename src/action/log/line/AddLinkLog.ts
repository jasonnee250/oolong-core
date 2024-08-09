import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {OolongLinkInfo} from "@/graphics/OolongLinkLine";
import {RemoveLinkLog} from "@/action/log/line/RmoveLinkLog";

export enum LinkEndType{
    Start="Start",
    End="End",
}
export class AddLinkLog implements IActionLog {
    type: ActionType=ActionType.AddLink;
    reverseLog:RemoveLinkLog|null=null;
    lineId:string;
    linkType:LinkEndType;
    linkEndInfo:OolongLinkInfo;

    constructor(lineId:string,linkType:LinkEndType,linkEndInfo:OolongLinkInfo) {
        this.lineId=lineId;
        this.linkType=linkType;
        this.linkEndInfo=linkEndInfo;
    }
    reverse(): IActionLog {
        return new RemoveLinkLog(this.lineId,this.linkType);
    }
    clone(): IActionLog {
        return new AddLinkLog(this.lineId,this.linkType,new OolongLinkInfo(this.linkEndInfo.id,this.linkEndInfo.connectPoint));
    }

}