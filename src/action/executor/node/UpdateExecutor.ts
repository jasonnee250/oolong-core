import {ActionType} from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog";
import {OolongNodeDO} from "@/file/OolongNodeDO";
import {OolongNode} from "@/graphics/OolongNode";
import {InteractiveUtils} from "dahongpao-canvas";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";

export class UpdateExecutor extends AbsActionExecutor {
    exec(actionLog: UpdateNodeLog, ctx: ExecutorContext): void {
        const nodeData = actionLog.data;
        if (!nodeData.id) {
            throw new Error("数据错误，缺少id");
        }
        const node = ctx.nodeManager.nodeMap.get(nodeData.id);
        if (!node) {
            throw new Error("node 不存在！")
        }
        const nodeDO = (node as OolongNode).serializeTo();
        // const prev=node.getRectNode();
        this._updateNodeByData(ctx, node as OolongNode, nodeData);
        ctx.nodeManager.removeIndexNode(node.getRectNode());
        ctx.nodeManager.addIndexNode(node.getRectNode());

        ctx.renderManager.addDrawNode(node);

        actionLog.reverseLog = new UpdateNodeLog(nodeDO);
        ctx.auxiliaryManager.renderToolMenu();
    }

    type(): ActionType {
        return ActionType.UpdateNode;
    }

    _updateNodeByData(ctx: ExecutorContext, node: OolongNode, data: Partial<OolongNodeDO>) {
        if (data.type!==undefined) {
            node.type = data.type;
        }
        if (data.shapeType !== undefined) {
            node.shapeType = data.shapeType;
            if (node.oolongText && node.oolongText.hasText()) {
                const cachePos = node.computeTextPos()!;
                node.oolongText.updatePos(cachePos);
                const textContentRect = node.getTextContentRect();
                node.oolongText.limitWidth = textContentRect.width;
                const cursorPosition = new TextCursorPosition(0, 0, -1);
                const positionPtr = node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                node.oolongText.reTypesetting(ctx.pageManager, positionPtr, node);
            }
        }
        if (data.x!==undefined) {
            node.x = data.x;
            if (node.oolongText) {
                node.oolongText.x = data.x;
            }
        }
        if (data.y!==undefined) {
            node.y = data.y;
            if (node.oolongText) {
                node.oolongText.y = data.y;
            }
        }
        if(data.angle!==undefined){
            node.angle=data.angle;
        }
        if (node.oolongText && (data.x !== undefined || data.y !== undefined)) {
            const cachePos = node.computeTextPos()!;
            node.oolongText.updatePos(cachePos);
            const cursorPosition = new TextCursorPosition(0, 0, -1);
            const positionPtr = node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
            node.oolongText.reTypesetting(ctx.pageManager, positionPtr, node);
        }
        if(data.zIndex!==undefined){
            node.zIndex=data.zIndex;
        }
        if (data.w!==undefined) {
            node.w = data.w;
            if (node.oolongText) {
                const textContentRect = node.getTextContentRect();
                node.oolongText.limitWidth = textContentRect.width;
            }
        }
        if (data.h!==undefined) {
            node.h = data.h;
        }
        if (data.alpha!==undefined) {
            node.alpha = data.alpha;
        }
        if (data.color) {
            node.color = data.color;
        }
        if (data.fontColor && node.oolongText) {
            node.fontColor = data.fontColor;
            node.oolongText.updateFontColor(data.fontColor);
        }
        if (data.fontFamily && node.oolongText) {
            node.fontFamily = data.fontFamily;
            node.oolongText.fontFamily = data.fontFamily;
        }
        if (node.oolongText && data.horizonAlign !== undefined) {
            node.horizonAlign = data.horizonAlign;
            node.oolongText.updateHorizonAlign(data.horizonAlign);
            const cursorPosition = new TextCursorPosition(0, 0, -1);
            const positionPtr = node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
            node.oolongText.reTypesetting(ctx.pageManager, positionPtr, node);
        }
        if (node.oolongText && data.verticalAlign !== undefined) {
            node.verticalAlign = data.verticalAlign;
            //更新文字坐标
            const cachePos = node.computeTextPos()!;
            node.oolongText.x = cachePos.x;
            node.oolongText.y = cachePos.y;
            node.oolongText.updatePos(cachePos);

            const cursorPosition = new TextCursorPosition(0, 0, -1);
            const positionPtr = node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
            node.oolongText.reTypesetting(ctx.pageManager, positionPtr, node);
        }
        if (data.fontSize && node.oolongText) {
            node.fontSize = data.fontSize;
            node.oolongText.updateFontSize(data.fontSize);
            const cursorPosition = new TextCursorPosition(0, 0, -1);
            const positionPtr = node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
            node.oolongText.reTypesetting(ctx.pageManager, positionPtr, node);
        }
        if (data.bold !== undefined && node.oolongText) {
            node.oolongText.updateBold(data.bold);
        }
        if (data.italic !== undefined && node.oolongText) {
            node.oolongText.updateItalic(data.italic);
        }
        if (data.borderWidth) {
            node.borderWidth = data.borderWidth;
        }
        if (data.borderColor) {
            node.borderColor = data.borderColor;
        }
        if (data.borderAlpha) {
            node.borderAlpha = data.borderAlpha;
        }
        if (data.lineDashType) {
            node.lineDashType = data.lineDashType;
        }
        if(data.x!==undefined||data.y!==undefined||data.w!==undefined||data.h!==undefined||data.angle!==undefined){
            node.updateTransformMatrix();
        }
    }

}