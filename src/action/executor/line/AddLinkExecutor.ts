import {ActionType} from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {AddLinkLog, LinkEndType} from "@/action/log/line/AddLinkLog";
import {OolongLinkLine} from "@/graphics/OolongLinkLine";

export class AddLinkExecutor extends AbsActionExecutor {
    exec(actionLog: AddLinkLog, ctx: ExecutorContext): void {
        const {lineId,linkEndInfo,linkType}=actionLog;
        const linkLineInfo=new OolongLinkLine(lineId);
        if(linkType===LinkEndType.Start){
            linkLineInfo.start=linkEndInfo;
            ctx.nodeManager.addUpdateLinkLineInfo(linkLineInfo);
        }else if(linkType===LinkEndType.End){
            linkLineInfo.end=linkEndInfo;
            ctx.nodeManager.addUpdateLinkLineInfo(linkLineInfo);
        }else{
            throw new Error("add link Log Error!");
        }

    }
    type(): ActionType {
        return ActionType.AddLink;
    }
}