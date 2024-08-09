import {ActionType} from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {RemoveLinkLog} from "@/action/log/line/RmoveLinkLog";
import {AddLinkLog, LinkEndType} from "@/action/log/line/AddLinkLog";

export class RemoveLinkExecutor extends AbsActionExecutor {
    exec(actionLog: RemoveLinkLog, ctx: ExecutorContext): void {
        const {lineId,linkType}=actionLog;
        const linkLineInfo=ctx.nodeManager.oolongLinkMap.get(lineId);
        if(!linkLineInfo){
            console.error("delete link error!");
            return;
        }
        if(linkType===LinkEndType.Start){
            if(!linkLineInfo.start){
                console.error("delete link error!");
                return;
            }
            actionLog.reverseLog=new AddLinkLog(lineId,linkType,linkLineInfo.start);
            //exec
            ctx.nodeManager.removeNodeLinkMap(linkLineInfo.start.id,linkLineInfo.id);
            linkLineInfo.start=undefined;
            if(!linkLineInfo.end){
                ctx.nodeManager.oolongLinkMap.delete(linkLineInfo.id);
            }
        }else if(linkType===LinkEndType.End){
            if(!linkLineInfo.end){
                console.error("delete link error!");
                return;
            }
            actionLog.reverseLog=new AddLinkLog(lineId,linkType,linkLineInfo.end);
            //exec
            ctx.nodeManager.removeNodeLinkMap(linkLineInfo.end.id,linkLineInfo.id);
            linkLineInfo.end=undefined;
            if(!linkLineInfo.start){
                ctx.nodeManager.oolongLinkMap.delete(linkLineInfo.id);
            }
        }
    }
    type(): ActionType {
        return ActionType.RemoveLink;
    }
}