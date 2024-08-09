import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {MoveCursorTextLog} from "@/action/log/text/MoveCursorTextLog";
import {ActionType} from "@/action/base/ActionType.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {InteractiveUtils} from "dahongpao-canvas";
import {Point} from "dahongpao-core";

export class MoveCursorTextExecutor extends AbsActionExecutor {
    exec(actionLog: MoveCursorTextLog, ctx: ExecutorContext): void {
        const typeWriter=ctx.inputManager.typeWriter;
        if(!typeWriter){
            console.error("没有文字处于编辑状态");
            return;
        }
        const curPosition=typeWriter.getEditPosition();
        typeWriter.loadEditPosition(actionLog.position);

        if(typeWriter.oolongText.toNodeId!==null){
            const node=ctx.nodeManager.nodeMap.get(typeWriter.oolongText.toNodeId) as OolongNode|undefined;
            if(node){
                const point=typeWriter.getCursorPosition();
                const textContentRect=node.getTextContentRect();
                const lineHeight=typeWriter.editPosition.linePtr!.data!.height;
                if(point.y<textContentRect.y || point.y+lineHeight>textContentRect.y+textContentRect.height){
                    const cachePos = new Point(typeWriter.oolongText.x,typeWriter.oolongText.y);
                    //超过底边
                    if (point.y+lineHeight  > textContentRect.y + textContentRect.height) {
                        cachePos.y=cachePos.y-(point.y+lineHeight - textContentRect.y - textContentRect.height);
                    }
                    //超过上边
                    if (point.y  < textContentRect.y) {
                        cachePos.y=cachePos.y+( textContentRect.y - point.y);
                    }
                    typeWriter.oolongText.updatePos(cachePos);
                    const cursorPosition=new TextCursorPosition(0,0,-1);
                    const positionPtr=typeWriter.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                    typeWriter.oolongText.reTypesetting(ctx.pageManager,positionPtr,node);
                    //渲染
                    const bounds=node.getBounds();
                    const graphics = InteractiveUtils.needDrawByMoving(ctx,bounds,new Set<string>(),node);
                    ctx.gmlRender.dirtyDraw(bounds, graphics);

                    typeWriter.loadEditPosition(actionLog.position);
                }
            }
        }
        typeWriter.updateEditPositionCursor();
        actionLog.reverseLog=new MoveCursorTextLog(actionLog.id,curPosition);
    }

    type(): ActionType {
        return ActionType.MoveCursor;
    }

}