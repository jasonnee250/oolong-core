import {ActionType} from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog";
import {InteractiveUtils} from "dahongpao-canvas";
import {OolongLine} from "@/graphics/OolongLine";
import {OolongLineDO} from "@/file/OolongLineDO";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";

export class UpdateLineExecutor extends AbsActionExecutor {

    exec(actionLog: UpdateLineLog, ctx: ExecutorContext): void {
        const nodeData = actionLog.data;
        if (!nodeData.id) {
            throw new Error("数据错误，缺少id");
        }
        const ele = ctx.nodeManager.lineMap.get(nodeData.id);
        if (!ele) {
            throw new Error("node 不存在！")
        }
        const node = ele as OolongLine;
        ctx.nodeManager.removeIndexNode(node.getRectNode());
        const nodeDO=(node as OolongLine).serializeTo();
        // const prev=node.getRectNode();
        this._updateNodeByData(node,nodeData,ctx);
        ctx.nodeManager.addIndexNode(node.getRectNode());

        ctx.renderManager.addDrawNode(node);

        actionLog.reverseLog=new UpdateLineLog(nodeDO);
        ctx.auxiliaryManager.renderToolMenu();

    }

    type(): ActionType {
        return ActionType.UpdateLine;
    }

    _updateNodeByData(node:OolongLine,data:Partial<OolongLineDO>,ctx:ExecutorContext){
        if(data.type){
            node.type=data.type;
        }
        if(data.shapeType){
            node.shapeType=data.shapeType;
        }
        if(data.alpha){
            node.alpha=data.alpha;
        }
        if(data.color){
            node.color=data.color;
        }
        if(data.zIndex!==undefined){
            node.zIndex=data.zIndex;
        }
        if(data.fontColor){
            node.fontColor=data.fontColor;
            if(node.oolongText){
                node.oolongText.updateFontColor(data.fontColor);
            }
        }
        if(data.fontSize){
            node.fontSize=data.fontSize;
            if(node.oolongText){
                node.oolongText.updateFontSize(data.fontSize);
                const cursorPosition = new TextCursorPosition(0, 0, -1);
                const positionPtr = node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                node.oolongText.reTypesetting(ctx.pageManager, positionPtr, node);
            }
        }
        if (data.bold !== undefined && node.oolongText) {
            node.oolongText.updateBold(data.bold);
        }
        if (data.italic !== undefined && node.oolongText) {
            node.oolongText.updateItalic(data.italic);
        }
        if(data.width){
            node.width=data.width
        }
        if(data.points){
            node.points=data.points;
            if(node.oolongText){
                const cachePos=node.computeTextPos()!;
                node.oolongText.updatePos(cachePos);
                const cursorPosition=new TextCursorPosition(0,0,-1);
                const positionPtr=node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                node.oolongText.reTypesetting(ctx.pageManager,positionPtr);
            }
        }
        if(data.rArrow){
            node.rArrow=data.rArrow;
        }
        if(data.lArrow){
            node.lArrow=data.lArrow;
        }
        if(data.lineDashType){
            node.lineDashType=data.lineDashType;
        }


    }

}