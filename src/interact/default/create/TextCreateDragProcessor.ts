import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {GraphicNode, Point, TextAlignType} from "dahongpao-core";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {generateDefaultNodeDO, OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {IdGenerator} from "@/utils/IdGenerator.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {SelectDrawer} from "@/select/SelectDrawer.ts";
import {Rect} from "@/text/base/Rect.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";

export class TextCreateDragProcessor extends StreamProcessor {

    startPos: Point = new Point();
    target: GraphicNode | null = null;

    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        this.startPos = InteractiveUtils.trimPoint(event.globalPoint);
        const nodeId=IdGenerator.genId(OolongNodeType.Shape);
        const shapeType=OolongShapeType.PureText;
        const nodeDO: OolongNodeDO = generateDefaultNodeDO(nodeId,shapeType as OolongShapeType);
        nodeDO.zIndex = IdGenerator.genZIndex();
        nodeDO.x = this.startPos.x;
        nodeDO.y = this.startPos.y;
        nodeDO.w=5;
        nodeDO.h=5;
        nodeDO.horizonAlign=TextAlignType.TOP_OR_LEFT;
        nodeDO.verticalAlign=TextAlignType.TOP_OR_LEFT;
        ctx.actionManager.execAction(new StartLog());
        const addLog=new AddNodeLog(nodeDO);
        ctx.actionManager.execAction(addLog);
        this.target=ctx.nodeManager.nodeMap.get(nodeId)!;
    }

    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        const updateData=(this.target as OolongNode).serializeTo();
        this.computeRectBounds(event,updateData);
        const updateLog=new UpdateNodeLog(updateData);
        ctx.actionManager.execAction(updateLog);
        //draw
        const rect=Rect.points2Rect([this.startPos,InteractiveUtils.trimPoint(event.globalPoint)]);
        const auxiliaryGlCtx=ctx.auxiliaryManager.gmlRender.canvas!.getContext("2d")!;
        SelectDrawer.drawBounds(auxiliaryGlCtx,rect);
    }

    onUp(event: InteractiveEvent, ctx: OolongEventContext): void {
        if (!this.target) {
            return;
        }
        const updateData=(this.target as OolongNode).serializeTo();

        this.computeRectBounds(event,updateData);
        if (this.target.w < 5) {
            updateData.w = 5;
        }
        if (this.target.h < 5) {
            updateData.h = 5;
        }
        const updateLog=new UpdateNodeLog(updateData);
        ctx.actionManager.execAction(updateLog);
        ctx.actionManager.execAction(new SelectNodeLog([this.target.id]));
        ctx.actionManager.execAction(new FocusTextLog(this.target.id,FocusTextType.Editing,new TextCursorPosition(0,0,-1)));
        ctx.actionManager.execAction(new EndLog());
        this.target = null;
        ctx.toolManager.resetTool();
    }

    computeRectBounds(event: InteractiveEvent,nodeDO:Partial<OolongNodeDO>) {
        if (!this.target) {
            return;
        }
        const globalPoint = InteractiveUtils.trimPoint(event.globalPoint);
        if (globalPoint.x >= this.startPos.x && globalPoint.y >= this.target.y) {
            nodeDO.x = this.startPos.x;
            nodeDO.y = this.startPos.y;
            nodeDO.w = globalPoint.x - this.startPos.x;
            nodeDO.h = globalPoint.y - this.startPos.y;
        } else if (globalPoint.x > this.startPos.x && globalPoint.y < this.target.y) {
            nodeDO.x = this.startPos.x;
            nodeDO.y = globalPoint.y;
            nodeDO.w = globalPoint.x - this.startPos.x;
            nodeDO.h = this.startPos.y - globalPoint.y;
        } else if (globalPoint.x < this.startPos.x && globalPoint.y > this.target.y) {
            nodeDO.x = globalPoint.x;
            nodeDO.y = this.startPos.y;
            nodeDO.w = this.startPos.x - globalPoint.x;
            nodeDO.h = globalPoint.y - this.startPos.y;
        } else if (globalPoint.x <= this.startPos.x && globalPoint.y <= this.target.y) {
            nodeDO.x = globalPoint.x;
            nodeDO.y = globalPoint.y;
            nodeDO.w = this.startPos.x - globalPoint.x;
            nodeDO.h = this.startPos.y - globalPoint.y;
        } else {
            nodeDO.x = globalPoint.x;
            nodeDO.y = globalPoint.y;
            nodeDO.w = globalPoint.x - this.startPos.x;
            nodeDO.h = globalPoint.y - this.startPos.y;
        }
    }

}