import { ActionType } from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {TextParagraphPropLog} from "@/action/log/text/TextParagraphPropLog.ts";
import {OolongText} from "@/text/base/OolongText";
import {TextCursorPosition} from "@/text/base/TextCursorPosition";
import {IGraphicElement, RectNode} from "dahongpao-core";
import {OolongNodeManager} from "@/app/OolongNodeManager.ts";

export class TextParagraphPropExecutor extends AbsActionExecutor {
    exec(actionLog: TextParagraphPropLog, ctx: ExecutorContext): void {
        const node=(ctx.nodeManager as OolongNodeManager).getTextNode(actionLog.nodeId);
        if(!node){
            throw new Error("node 不存在！")
        }
        if(!(node instanceof OolongText)){
            throw new Error("node 类型错误，不是text类型！")
        }
        const textNode=node as OolongText;

        const paragraph=textNode.getParagraphByIndex(actionLog.paragraphIndex);
        if(!paragraph){
            throw new Error("数据错误！")
        }
        actionLog.reverseLog=new TextParagraphPropLog(node.id,actionLog.paragraphIndex,paragraph.fontSize,paragraph.horizonAlign);
        if(actionLog.fontSize===undefined && actionLog.horizonAlign===undefined){
            return;
        }
        if(actionLog.fontSize!==undefined){
            paragraph.fontSize=actionLog.fontSize;
            paragraph.reTypeCharSize();
            const cursorPosition=new TextCursorPosition(actionLog.paragraphIndex,0,-1);
            const positionPtr=textNode.getPositionPtrFromCursorPosition(cursorPosition);
            textNode.reTypesetting(ctx.pageManager,positionPtr);
            if(ctx.inputManager.typeWriter){
                const editPos=ctx.inputManager.typeWriter.editPosition.serializeTo();
                ctx.inputManager.typeWriter.loadEditPosition(editPos);
            }
        }
        if(actionLog.horizonAlign!==undefined){
            paragraph.horizonAlign=actionLog.horizonAlign;
            const cursorPosition=new TextCursorPosition(actionLog.paragraphIndex,0,-1);
            const positionPtr=textNode.getPositionPtrFromCursorPosition(cursorPosition);
            textNode.reTypesettingParagraph(ctx.pageManager,positionPtr);
            if(ctx.inputManager.typeWriter){
                const editPos=ctx.inputManager.typeWriter.editPosition.serializeTo();
                ctx.inputManager.typeWriter.loadEditPosition(editPos);
            }
        }
        //重绘&渲染
        ctx.renderManager.addDrawNode(node);

        //选区重新绘制
        ctx.auxiliaryManager.selectionManager.reGenerateSelect();
        ctx.renderManager.addAuxiliaryDrawTask();

        //如果有光标，需要重绘光标位置
        const typeWriter=ctx.inputManager.typeWriter;
        if(typeWriter){
            // typeWriter.updateEditPositionCursor();
            //并且重新focus
            ctx.inputManager.focus();
        }

    }
    type(): ActionType {
        return ActionType.TextParagraphProp;
    }

    _bufferBounds(bounds: RectNode,scale:number,buffer=2){
        bounds.minX = Math.round((bounds.minX) * scale - buffer) / scale;
        bounds.minY = Math.round((bounds.minY) * scale - buffer) / scale;
        bounds.maxX = Math.round((bounds.maxX) * scale + 2 * buffer) / scale;
        bounds.maxY = Math.round((bounds.maxY) * scale + 2 * buffer) / scale;
    }
    
}