import { ActionType } from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {RemoveNodeLog} from "@/action/log/node/RemoveNodeLog";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {InteractiveUtils as OolongInteractUtils} from "@/interact/InteractiveUtils.ts";
import {AddLineLog} from "@/action/log/line/AddLineLog.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";


export class RemoveExecutor extends AbsActionExecutor {
    exec(actionLog: RemoveNodeLog, ctx: ExecutorContext): void {
        const node=ctx.nodeManager.nodeMap.get(actionLog.id);
        if(node){
            this._deleteNode(node as OolongNode,actionLog,ctx);
            return;
        }
        const line=ctx.nodeManager.lineMap.get(actionLog.id);
        if(line){
            this._deleteLine(line as OolongLine,actionLog,ctx);
            return;
        }
        return;

    }
    type(): ActionType {
        return  ActionType.RemoveNode;
    }

    _deleteLine(line:OolongLine,actionLog: RemoveNodeLog, ctx: ExecutorContext){
        const nodeDO=line.serializeTo();
        actionLog.addNodeLog=new AddLineLog(nodeDO);
        ctx.nodeManager.lineMap.delete(line.id);

        ctx.renderManager.addDrawNode(line);
    }

    _deleteNode(node:OolongNode,actionLog: RemoveNodeLog, ctx: ExecutorContext){
        const nodeDO=node.serializeTo();
        actionLog.addNodeLog=new AddNodeLog(nodeDO);
        ctx.nodeManager.removeNode(node);

        ctx.renderManager.addDrawNode(node);
    }

}