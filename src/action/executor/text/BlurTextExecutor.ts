import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {BlurTextLog, FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {ActionType} from "@/action/base/ActionType.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";

export class BlurTextExecutor extends AbsActionExecutor {

    exec(actionLog: BlurTextLog, ctx: ExecutorContext): void {
        const typeWriter=ctx.inputManager.typeWriter;
        if(!typeWriter){
            console.warn("目前没有节点处于focus，不需要blur");
            return;
        }
        ctx.auxiliaryManager.clearTextSelection();
        const editPosition=typeWriter.getEditPosition();
        const oolongText=typeWriter.oolongText;
        if(oolongText.toNodeId!==null){
            const node=ctx.nodeManager.nodeMap.get(oolongText.toNodeId) as OolongNode|undefined;
            if(node){
                    const cachePos=node.computeTextPos()!;
                    oolongText.updatePos(cachePos);
                    const cursorPosition=new TextCursorPosition(0,0,-1);
                    const positionPtr=oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                    oolongText.reTypesetting(ctx.pageManager,positionPtr,node);
                ctx.renderManager.addDrawNode(node);
            }
            const line=ctx.nodeManager.lineMap.get(oolongText.toNodeId) as OolongLine|undefined;
            if(line){
                const cachePos=line.computeTextPos();
                oolongText.updatePos(cachePos);
                const cursorPosition=new TextCursorPosition(0,0,-1);
                const positionPtr=oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                oolongText.reTypesetting(ctx.pageManager,positionPtr);
                ctx.renderManager.addDrawNode(line);
            }
        }
        actionLog.focusTextLog=new FocusTextLog(oolongText.id,FocusTextType.Editing,editPosition);
        ctx.inputManager.blur();
    }

    type(): ActionType {
        return ActionType.BlurText;
    }
}