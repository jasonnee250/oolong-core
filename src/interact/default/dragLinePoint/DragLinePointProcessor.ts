import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {GraphicUtils, Point} from "dahongpao-core";
import {StartLog} from "@/action/log/common/StartLog";
import {OolongLineDO} from "@/file/OolongLineDO";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog";
import {EndLog} from "@/action/log/common/EndLog";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {ControlPointRes} from "@/interact/detector/PolyLineControlPointDetector.ts";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants.ts";

export class DragLinePointProcessor extends StreamProcessor {

    res: ControlPointRes | null = null;

    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        const detector = ctx.detectors.get(OolongDetectorEnum.PolyControlPoint);
        if (!detector || !detector.detect(event, ctx)) {
            return;
        }
        const res = detector.result as ControlPointRes;
        this.res = res;
        ctx.actionManager.execAction(new StartLog());

    }

    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        if (!this.res) {
            return;
        }
        const line = this.res.line;
        let points: Point[] = [...line.points];
        const isHorizon = this.res.isHorizon;
        const cp = this.res.controlPoint;
        if (this.res.lPointIndex > 0 && this.res.rPointIndex < line.points.length - 1) {
            //中间节点
            const lp = points[this.res.lPointIndex];
            const rp = points[this.res.rPointIndex];
            if (!isHorizon) {
                lp.x = event.globalPoint.x;
                rp.x = event.globalPoint.x;
            } else {
                lp.y = event.globalPoint.y;
                rp.y = event.globalPoint.y;
            }
            //left点判断
            const llp = points[this.res.lPointIndex - 1];
            if (GraphicUtils.distance(lp, llp) < 1) {
                let lPoints:Point[];
                const mergeStartPoint=this.res.lPointIndex-1===0;
                if(mergeStartPoint){
                    lPoints = points.slice(0, this.res.lPointIndex);
                }else{
                    lPoints = points.slice(0, this.res.lPointIndex - 1);
                }
                const rPoints = points.slice(this.res.rPointIndex, points.length);
                points = [...lPoints, ...rPoints];
                if(mergeStartPoint){
                    this.res.lPointIndex -= 1;
                    this.res.rPointIndex -= 1;
                }else{
                    this.res.lPointIndex -= 2;
                    this.res.rPointIndex -= 2;
                }
                this._sendMsg(line.id,points,ctx);
                return;
            }
            //right点判断
            const rrp = points[this.res.rPointIndex + 1];
            if (GraphicUtils.distance(rp, rrp) < 1) {
                const lPoints = points.slice(0, this.res.rPointIndex);
                let rPoints:Point[];
                if(this.res.rPointIndex+1===points.length-1){
                    rPoints = points.slice(this.res.rPointIndex + 1, points.length);
                }else{
                    rPoints = points.slice(this.res.rPointIndex + 2, points.length);
                }
                points = [...lPoints, ...rPoints];
                this._sendMsg(line.id,points,ctx);
                return;
            }
            this._sendMsg(line.id,points,ctx);
            return;
        }
        if (this.res.lPointIndex === 0) {
            //左侧端点
            const start = points.shift()!;
            if (isHorizon) {
                const delta = cp.x > start.x ? LinePadding : -LinePadding;
                const insertP = new Point(start.x + delta, start.y);
                points = [start, {...insertP}, insertP, ...points];
            } else {
                const delta = cp.y > start.y ? LinePadding : -LinePadding;
                const insertP = new Point(start.x, start.y + delta);
                points = [start, {...insertP}, insertP, ...points];
            }
            this.res.lPointIndex += 2;
            this.res.rPointIndex += 2;
            this._sendMsg(line.id,points,ctx);
            return;
        }
        if (this.res.rPointIndex === points.length - 1) {
            //右侧端点
            const end = points.pop()!;
            if (isHorizon) {
                const delta = cp.x > end.x ? LinePadding : -LinePadding;
                const insertP = new Point(end.x + delta, end.y);
                points = [...points, insertP, {...insertP}, end];
            } else {
                const delta = cp.y > end.y ? LinePadding : -LinePadding;
                const insertP = new Point(end.x, end.y + delta);
                points = [...points, insertP, {...insertP}, end];
            }
            this._sendMsg(line.id,points,ctx);
            return;
        }
    }

    onUp(_event: InteractiveEvent, ctx: OolongEventContext): void {
        if (!this.res) {
            return;
        }
        ctx.actionManager.execAction(new EndLog());
        this.res = null;
        ctx.toolManager.resetTool();
    }

    private _sendMsg(lineId:string,points:Point[],ctx:OolongEventContext){
        const updateData = {} as Partial<OolongLineDO>;
        updateData.id = lineId;
        updateData.points = points;
        const updateLog = new UpdateLineLog(updateData);
        ctx.actionManager.execAction(updateLog);
    }

}