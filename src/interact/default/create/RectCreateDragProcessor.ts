import { InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {Point, GraphicNode, TextAlignType} from "dahongpao-core";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {generateDefaultNodeDO, OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {IdGenerator} from "@/utils/IdGenerator.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {SelectDrawer} from "@/select/SelectDrawer.ts";
import {Rect} from "@/text/base/Rect.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";
import {DefaultBorderColorShape, DefaultColorShape} from "@/interact/default/create/CreateColorConfig.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";

export class RectCreateDragProcessor extends StreamProcessor {

    startPos: Point = new Point();
    target: GraphicNode | null = null;

    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        this.startPos = InteractiveUtils.trimPoint(event.globalPoint);
        const nodeId=IdGenerator.genId(OolongNodeType.Shape);
        const shapeType=ctx.toolManager.shapeType;
        const nodeDO: OolongNodeDO = generateDefaultNodeDO(nodeId,shapeType as OolongShapeType);

        nodeDO.color=DefaultColorShape[shapeType]||"#ffffff";
        nodeDO.borderColor=DefaultBorderColorShape[shapeType]||"#000000";
        nodeDO.borderWidth=2;
        nodeDO.zIndex = IdGenerator.genZIndex();
        nodeDO.x = this.startPos.x;
        nodeDO.y = this.startPos.y;
        nodeDO.w=5;
        nodeDO.h=5;
        nodeDO.horizonAlign=TextAlignType.CENTER;
        nodeDO.verticalAlign=TextAlignType.CENTER;
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
        if (this.target.w < 5.1) {
            updateData.w = 100;
        }
        if (this.target.h < 5.1) {
            updateData.h = 100;
        }
        const updateLog=new UpdateNodeLog(updateData);
        ctx.actionManager.execAction(updateLog);
        ctx.actionManager.execAction(new SelectNodeLog([this.target.id]));
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