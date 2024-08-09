import {ActionType} from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {MoveNodeLog} from "@/action/log/node/MoveNodeLog";
import {OolongNode} from "@/graphics/OolongNode";
import {InteractiveUtils} from "dahongpao-canvas";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";

export class MoveNodeExecutor extends AbsActionExecutor {
    exec(actionLog: MoveNodeLog, ctx: ExecutorContext): void {
        const node=ctx.nodeManager.nodeMap.get(actionLog.id);
        if(node){
            this.moveNode(node as OolongNode,actionLog,ctx);
           return;
        }
        const line=ctx.nodeManager.lineMap.get(actionLog.id);
        if(line){
            if(line instanceof OolongLine){
                this.moveLine(line,actionLog,ctx);
                return;
            }
        }
        throw new Error("node 不存在！")


    }
    type(): ActionType {
        return ActionType.MoveNode;
    }

    moveNode(node:OolongNode,actionLog:MoveNodeLog,ctx: ExecutorContext){
        node.x+=actionLog.dx;
        node.y+=actionLog.dy;
        node.updateTransformMatrix();
        (node as OolongNode).oolongText?.updateDeltaPos(actionLog.dx,actionLog.dy);
        ctx.nodeManager.removeIndexNode(node.getRectNode());
        ctx.nodeManager.addIndexNode(node.getRectNode());

        ctx.renderManager.addDrawNode(node);

        actionLog.reverseLog=new MoveNodeLog(node.id,-actionLog.dx,-actionLog.dy);
        ctx.auxiliaryManager.renderToolMenu();
    }

    moveLine(node:OolongLine,actionLog:MoveNodeLog,ctx: ExecutorContext){
        // const prev=node.getRectNode();

        node.points.forEach(p=>{
            p.x+=actionLog.dx;
            p.y+=actionLog.dy;
        })

        if(node.oolongText){
            const cachePos=node.computeTextPos()!;
            node.oolongText.updatePos(cachePos);
            const cursorPosition=new TextCursorPosition(0,0,-1);
            const positionPtr=node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
            node.oolongText.reTypesetting(ctx.pageManager,positionPtr);
        }

        ctx.nodeManager.removeIndexNode(node.getRectNode());
        ctx.nodeManager.addIndexNode(node.getRectNode());

        ctx.renderManager.addDrawNode(node);
        actionLog.reverseLog=new MoveNodeLog(node.id,-actionLog.dx,-actionLog.dy);
        ctx.auxiliaryManager.renderToolMenu();
    }

}