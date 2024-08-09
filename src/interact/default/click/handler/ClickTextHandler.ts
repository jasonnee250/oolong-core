import {ClickHandler, InteractiveEvent} from "dahongpao-canvas";
import {ToolEnum} from "@/tool/ToolEnum";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {StartLog} from "@/action/log/common/StartLog";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog";
import {EndLog} from "@/action/log/common/EndLog";
import {IdGenerator} from "@/utils/IdGenerator";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongShapeType} from "@/graphics/OolongShapeType";
import {generateDefaultNodeDO, OolongNodeDO} from "@/file/OolongNodeDO";
import {TextAlignType} from "dahongpao-core";
import {AddNodeLog} from "@/action/log/node/AddNodeLog";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";

export class ClickTextHandler extends ClickHandler{
    enable(_event: InteractiveEvent, eventCtx: OolongEventContext): boolean {
        return eventCtx.toolManager.currentTool===ToolEnum.TEXT;
    }
    handle(event: InteractiveEvent, ctx: OolongEventContext): void {
        ctx.actionManager.execAction(new StartLog());
        if(ctx.inputManager.typeWriter){
            ctx.actionManager.execAction(new FocusTextLog(undefined,FocusTextType.Blur));
        }
        const nodeId=IdGenerator.genId(OolongNodeType.Shape);
        const shapeType=OolongShapeType.PureText;
        const nodeDO: OolongNodeDO = generateDefaultNodeDO(nodeId,shapeType as OolongShapeType);
        nodeDO.zIndex = IdGenerator.genZIndex();
        nodeDO.x = event.globalPoint.x;
        nodeDO.y = event.globalPoint.y;
        nodeDO.w=100;
        nodeDO.h=30;
        nodeDO.horizonAlign=TextAlignType.TOP_OR_LEFT;
        nodeDO.verticalAlign=TextAlignType.TOP_OR_LEFT;
        ctx.actionManager.execAction(new StartLog());
        const addLog=new AddNodeLog(nodeDO);
        ctx.actionManager.execAction(addLog);
        ctx.actionManager.execAction(new SelectNodeLog([nodeId]));
        ctx.actionManager.execAction(new FocusTextLog(nodeId,FocusTextType.Editing,new TextCursorPosition(0,0,-1)));
        ctx.actionManager.execAction(new EndLog());
    }

}