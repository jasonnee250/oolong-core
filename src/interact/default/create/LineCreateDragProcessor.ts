import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {GraphicNode, LineArrowType, Point} from "dahongpao-core";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {IdGenerator} from "@/utils/IdGenerator.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {generateDefaultLineDO, OolongLineDO} from "@/file/OolongLineDO";
import {AddLineLog} from "@/action/log/line/AddLineLog";
import {OolongLine} from "@/graphics/OolongLine";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {ConnectPointRes} from "@/interact/detector/ConnectorPointDetector.ts";
import {OolongLinkInfo} from "@/graphics/OolongLinkLine.ts";
import {AddLinkLog, LinkEndType} from "@/action/log/line/AddLinkLog.ts";
import {LineLayoutWorker} from "@/interact/default/connectLine/layout/LineLayoutWorker.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";
import store from "@/store/RootStore.ts";
import {MenuType, setToolMenu} from "@/store/reducer/ToolMenuStateReducer.ts";

export class LineCreateDragProcessor extends StreamProcessor {

    startPos: Point = new Point();
    target: OolongLine | null = null;
    shapeType: OolongLineType = OolongLineType.Line;

    layoutWorker: LineLayoutWorker=LineLayoutWorker.getInstance();

    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        const globalPoint=InteractiveUtils.trimPoint(event.globalPoint);
        this.startPos = globalPoint;
        const nodeId = IdGenerator.genId(OolongNodeType.Line);
        const nodeDO: OolongLineDO = generateDefaultLineDO(nodeId);
        const shapeType = ctx.toolManager.shapeType as OolongLineType;
        this.shapeType = shapeType;
        if (this.shapeType === OolongLineType.Line) {
            nodeDO.rArrow = LineArrowType.None;
            nodeDO.lArrow = LineArrowType.None;
        }
        nodeDO.type = OolongNodeType.Line;
        nodeDO.shapeType = shapeType;
        nodeDO.zIndex = IdGenerator.genZIndex();
        nodeDO.points = [
            this.startPos,
            new Point(globalPoint.x + 1, globalPoint.y + 1)
        ];
        ctx.actionManager.execAction(new StartLog());
        const addLog = new AddLineLog(nodeDO);
        ctx.actionManager.execAction(addLog);
        this.target = ctx.nodeManager.lineMap.get(nodeId)! as OolongLine;
        if(this.shapeType === OolongLineType.PolyLine){
            const detector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
            if (detector && detector.detect(event, ctx)) {
                const startRes = detector.result as ConnectPointRes;
                const points = this.layoutWorker.layoutFreeEndPoint(startRes.connectorPoint, globalPoint, startRes.node);
                this._sendMsg(points,ctx);
                const linkInfo: OolongLinkInfo = new OolongLinkInfo(startRes.node.id, startRes.connectorPoint);
                ctx.actionManager.execAction(new AddLinkLog(this.target!.id, LinkEndType.Start, linkInfo));
            }
        }


    }

    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {

        const globalPoint=InteractiveUtils.trimPoint(event.globalPoint);
        if (this.shapeType === OolongLineType.PolyLine) {

            const detector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
            let endRes: null | ConnectPointRes = null;
            if (detector && detector.detect(event, ctx)) {
                endRes = detector.result as ConnectPointRes;
            }
            let startNode: GraphicNode | null = null;
            const linkLineInfo = ctx.nodeManager.oolongLinkMap.get(this.target!.id);
            if (linkLineInfo && linkLineInfo.start) {
                startNode = ctx.nodeManager.nodeMap.get(linkLineInfo.start.id)||null;
            }
            let points: Point[] = [];
            if (startNode) {
                if (endRes) {
                    points = this.layoutWorker.layout(linkLineInfo!.start!.connectPoint, endRes.connectorPoint, startNode, endRes.node);
                } else {
                    points = this.layoutWorker.layoutFreeEndPoint(linkLineInfo!.start!.connectPoint, globalPoint, startNode);
                }
            } else {
                if (endRes) {
                    points = this.layoutWorker.layoutFreeStartPoint(this.startPos, endRes.connectorPoint, endRes.node);
                } else {
                    points = InteractiveUtils.layout(this.startPos, globalPoint);
                }
            }
            this._sendMsg(points, ctx);
            return;
        }
        if (this.shapeType === OolongLineType.Curve) {
            const points = InteractiveUtils.curveLayout(this.startPos, globalPoint);
            this._sendMsg(points, ctx);
            return;
        }
        const points = [
            this.startPos,
            globalPoint,
        ];
        this._sendMsg(points, ctx);

    }

    onUp(event: InteractiveEvent, ctx: OolongEventContext): void {
        if (!this.target) {
            return;
        }
        let showQuickMenu=false;
        if (this.shapeType === OolongLineType.PolyLine){
            const detector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
            if (detector && detector.detect(event, ctx)) {
                const endRes = detector.result as ConnectPointRes;
                const linkLineInfo = ctx.nodeManager.oolongLinkMap.get(this.target.id);
                if (linkLineInfo && linkLineInfo.start) {
                    const startNode = ctx.nodeManager.nodeMap.get(linkLineInfo.start.id);
                    if (!startNode) {
                        console.error("起始节点被删除，找不到！");
                    } else {
                        const points = this.layoutWorker.layout(linkLineInfo.start.connectPoint, endRes.connectorPoint, startNode, endRes.node);
                        this._sendMsg(points,ctx);
                        const sameStartEnd = startNode.id === endRes.node.id
                            && Math.abs(linkLineInfo.start.connectPoint.xPos - endRes.connectorPoint.xPos) < 1
                            && Math.abs(linkLineInfo.start.connectPoint.yPos - endRes.connectorPoint.yPos) < 1;
                        if (!sameStartEnd) {
                            const linkInfo: OolongLinkInfo = new OolongLinkInfo(endRes.node.id, endRes.connectorPoint);
                            ctx.actionManager.execAction(new AddLinkLog(this.target!.id, LinkEndType.End, linkInfo));
                        }
                    }
                }else{
                    const points = this.layoutWorker.layoutFreeStartPoint(this.startPos, endRes.connectorPoint,endRes.node);
                    this._sendMsg(points,ctx);
                    const linkInfo: OolongLinkInfo = new OolongLinkInfo(endRes.node.id, endRes.connectorPoint);
                    ctx.actionManager.execAction(new AddLinkLog(this.target!.id, LinkEndType.End, linkInfo));
                }
            }else{
                showQuickMenu=true;
            }
        }
        ctx.actionManager.execAction(new SelectNodeLog([this.target!.id]));
        ctx.actionManager.execAction(new EndLog());
        if(showQuickMenu){
            ctx.setCursor("default");
            store.dispatch(setToolMenu({x:event.clientPoint.x,y:event.clientPoint.y,menuType:MenuType.QuickMenu}));
        }
        this.target = null;
        ctx.toolManager.resetTool();
    }

    private _sendMsg(points: Point[], ctx: OolongEventContext) {
        const updateData = {} as Partial<OolongLineDO>;
        updateData.id = this.target!.id;
        updateData.points = points;
        const updateLog = new UpdateLineLog(updateData);
        ctx.actionManager.execAction(updateLog);
    }

}