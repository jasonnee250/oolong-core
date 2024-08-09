import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "@/action/executor/ExecutorContext";
import {GraphicUtils} from "dahongpao-core";
import {InteractiveUtils} from "dahongpao-canvas";
import {ActionType} from "@/action/base/ActionType";
import {AddLineLog} from "@/action/log/line/AddLineLog.ts";
import {OolongLine} from "@/graphics/OolongLine";
import {IGraphicLine} from "dahongpao-core/dist/graphic/IGraphicLine";
import {RemoveNodeLog} from "@/action/log/node/RemoveNodeLog.ts";

export class AddLineExecutor extends AbsActionExecutor {

    exec(actionLog: AddLineLog, ctx: ExecutorContext): void {
        const glCtx = ctx.gmlRender.canvas!.getContext("2d")!;
        const node = OolongLine.load(actionLog.nodeData, glCtx, ctx.pageManager);
        this._drawNode(node,ctx);
        actionLog.reverseLog=new RemoveNodeLog(actionLog.nodeData.id);
    }

    type(): ActionType {
        return ActionType.AddLine;
    }

    _drawNode(node:IGraphicLine,ctx:ExecutorContext) {
        ctx.nodeManager.addLine(node);
        ctx.renderManager.addDrawNode(node);
    }
}