import { ActionType } from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {OolongNodeManager} from "@/app/OolongNodeManager";
import {OolongText} from "@/text/base/OolongText";
import {TextCursorPosition} from "@/text/base/TextCursorPosition";
import {IGraphicElement, RectNode} from "dahongpao-core";
import {TextParagraphListLog} from "@/action/log/text/TextParagraphListLog";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {ParaListInfo} from "@/text/base/TextListInfo.ts";

export class TextParagraphListExecutor extends AbsActionExecutor {
    exec(actionLog: TextParagraphListLog, ctx: ExecutorContext): void {
        const node=(ctx.nodeManager as OolongNodeManager).getTextNode(actionLog.nodeId);
        if(!node){
            throw new Error("node 不存在！")
        }
        if(node.type!==OolongNodeType.Text){
            throw new Error("node 类型错误，不是text类型！")
        }
        const textNode=node as OolongText;
        const paraListInfoList=actionLog.paraListInfoList.sort((a,b)=>a.pIndex-b.pIndex);
        const reverseParaListInfoList:ParaListInfo[]=[];
        for(const paraListInfo of paraListInfoList){
            const paragraph=textNode.getParagraphByIndex(paraListInfo.pIndex);
            if(!paragraph){
                throw new Error("数据错误！")
            }
            reverseParaListInfoList.push({pIndex:paragraph.index,listInfo:paragraph.listInfo});
            paragraph.listInfo=paraListInfo.listInfo;
            paragraph.reTypeCharSize();
            const cursorPosition=new TextCursorPosition(paraListInfo.pIndex,0,-1);
            const positionPtr=textNode.getPositionPtrFromCursorPosition(cursorPosition);
            textNode.reTypesetting(ctx.pageManager,positionPtr);
        }
        actionLog.reverseLog=new TextParagraphListLog(node.id,reverseParaListInfoList);
        if(ctx.inputManager.typeWriter){
            const editPos=ctx.inputManager.typeWriter.editPosition.serializeTo();
            ctx.inputManager.typeWriter.loadEditPosition(editPos);
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
            ctx.inputManager.focus();
        }
    }
    type(): ActionType {
        return ActionType.TextParagraphList;
    }

    _bufferBounds(bounds: RectNode,scale:number,buffer=2){
        bounds.minX = Math.round((bounds.minX) * scale - buffer) / scale;
        bounds.minY = Math.round((bounds.minY) * scale - buffer) / scale;
        bounds.maxX = Math.round((bounds.maxX) * scale + 2 * buffer) / scale;
        bounds.maxY = Math.round((bounds.maxY) * scale + 2 * buffer) / scale;
    }

}