import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {StartLog} from "@/action/log/common/StartLog";
import {OolongLineDO} from "@/file/OolongLineDO";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog";
import {EndLog} from "@/action/log/common/EndLog";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {LineEndRes} from "@/interact/detector/LineEndPointDetector";
import {Point} from "dahongpao-core";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {LineLayoutWorker} from "@/interact/default/connectLine/layout/LineLayoutWorker.ts";
import {ConnectPointRes} from "@/interact/detector/ConnectorPointDetector.ts";
import {AddLinkLog, LinkEndType} from "@/action/log/line/AddLinkLog.ts";
import {RemoveLinkLog} from "@/action/log/line/RmoveLinkLog.ts";
import {OolongLinkInfo} from "@/graphics/OolongLinkLine.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";

export class DragLineEndProcessor extends StreamProcessor{

    res:LineEndRes|null=null;

    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        const detector=ctx.detectors.get(OolongDetectorEnum.LineEndPoint);
        if(!detector||!detector.detect(event,ctx)){
            return;
        }
        const res=detector.result as LineEndRes;
        this.res=res;
        ctx.actionManager.execAction(new StartLog());
        ctx.actionManager.execAction(new SelectNodeLog([]));
        const linkLineInfo=ctx.nodeManager.oolongLinkMap.get(this.res.line.id);
        if(linkLineInfo?.start && this.res.isStart){
            ctx.actionManager.execAction(new RemoveLinkLog(this.res.line.id,LinkEndType.Start));
        }else if(linkLineInfo?.end && !this.res.isStart){
            ctx.actionManager.execAction(new RemoveLinkLog(this.res.line.id,LinkEndType.End));
        }
    }
    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        if(!this.res){
            return;
        }
        const updateData=this.generateUpdateData(event);
        const updateLog=new UpdateLineLog(updateData);
        ctx.actionManager.execAction(updateLog);
        const detector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
        if (detector && detector.detect(event, ctx)) {
            const res=detector.result as ConnectPointRes;
            this.layoutAndSendMsg(res,ctx);
        }
    }
    onUp(event: InteractiveEvent, ctx: OolongEventContext): void {
        if(!this.res){
            return;
        }
        let res:ConnectPointRes|null=null;
        const detector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
        if (detector && detector.detect(event, ctx)) {
            res=detector.result as ConnectPointRes;
        }
        ctx.actionManager.execAction(new SelectNodeLog([this.res.line.id]));
        if(!res){
            ctx.actionManager.execAction(new EndLog());
            ctx.auxiliaryManager.renderToolMenu();
            this.res = null;
            ctx.toolManager.resetTool();
            return;
        }
        this.layoutAndSendMsg(res,ctx);
        if(this.res.isStart){
            ctx.actionManager.execAction(new AddLinkLog(this.res.line.id,LinkEndType.Start,new OolongLinkInfo(res.node.id,res.connectorPoint)));
        }else{
            ctx.actionManager.execAction(new AddLinkLog(this.res.line.id,LinkEndType.End,new OolongLinkInfo(res.node.id,res.connectorPoint)));

        }
        ctx.actionManager.execAction(new EndLog());
        this.res = null;
        ctx.toolManager.resetTool();
    }

    layoutAndSendMsg(res:ConnectPointRes,ctx:OolongEventContext){
        if(!this.res){
            return;
        }
        const linkLineInfo=ctx.nodeManager.oolongLinkMap.get(this.res.line.id);
        if(this.res.line.shapeType === OolongLineType.PolyLine){
            let points=this.res.line.points;
            if(this.res.isStart){
                //拖动起点
                if(linkLineInfo?.end){
                    const endNode=ctx.nodeManager.nodeMap.get(linkLineInfo.end.id)!;
                    points=LineLayoutWorker.getInstance().layout(res.connectorPoint,
                        linkLineInfo.end!.connectPoint,res.node,endNode);
                }else{
                    points=LineLayoutWorker.getInstance().layoutFreeEndPoint(res.connectorPoint,
                        points[points.length-1],res.node);
                }
            }else{
                //拖动终点
                if(linkLineInfo?.start){
                    const startNode=ctx.nodeManager.nodeMap.get(linkLineInfo.start.id)!;
                    points=LineLayoutWorker.getInstance().layout(linkLineInfo.start.connectPoint,
                        res.connectorPoint,startNode,res.node);
                }else{
                    points=LineLayoutWorker.getInstance().layoutFreeStartPoint(points[0],res.connectorPoint,
                        res.node);
                }
            }
            this._sendMsg(points,ctx);
        }else if(this.res.line.shapeType===OolongLineType.Line){
            let points=this.res.line.points;
            if(this.res.isStart){
                points=[res.connectorPoint,points[points.length-1]];
            }else{
                points=[points[0],res.connectorPoint];
            }
            this._sendMsg(points,ctx);
        }else if(this.res.line.shapeType===OolongLineType.Curve){
            let points=this.res.line.points;
            if(this.res.isStart){
                points=InteractiveUtils.curveLayout(res.connectorPoint,points[points.length-1]);
            }else{
                points=InteractiveUtils.curveLayout(points[0],res.connectorPoint);
            }
            this._sendMsg(points,ctx);
        }
    }

    generateUpdateData(event: InteractiveEvent){
        if(this.res!.line.shapeType===OolongLineType.Line){
            return this.generateSimpleLineUpdateData(event.globalPoint);
        }
        if(this.res!.line.shapeType===OolongLineType.PolyLine){
            return this.generatePolyLineUpdateData(event.globalPoint);
        }
        if(this.res!.line.shapeType===OolongLineType.Curve){
            return this.generateCurveLineUpdateData(event.globalPoint);
        }
        return this.generateSimpleLineUpdateData(event.globalPoint);
    }

    generateSimpleLineUpdateData(globalPoint:Point){
        const line=this.res!.line;
        const points=[...line.points];
        const isStart=this.res!.isStart;
        if(isStart){
            points.shift();
            points.unshift({...globalPoint});
        }else{
            points.pop();
            points.push({...globalPoint});
        }
        const updateData={} as Partial<OolongLineDO>;
        updateData.id=line.id;
        updateData.points=points;
        return updateData;
    }

    generatePolyLineUpdateData(globalPoint:Point){
        const line=this.res!.line;
        const points=[...line.points];
        const isStart=this.res!.isStart;
        if(isStart){
            const p0=points.shift()!;
            const p=points[0];
            const isHorizon=InteractiveUtils.judgeHorizon(p,p0);
            if(isHorizon){
                p.y=globalPoint.y;
            }else{
                p.x=globalPoint.x;
            }
            points.unshift({...globalPoint});
        }else{
            const p0=points.pop()!;
            const p=points[points.length-1];
            const isHorizon=InteractiveUtils.judgeHorizon(p,p0);
            if(isHorizon){
                p.y=globalPoint.y;
            }else{
                p.x=globalPoint.x;
            }
            points.push({...globalPoint});
        }
        const updateData={} as Partial<OolongLineDO>;
        updateData.id=line.id;
        updateData.points=points;
        return updateData;
    }

    generateCurveLineUpdateData(globalPoint:Point){
        const line=this.res!.line;
        let points=[...line.points];
        const isStart=this.res!.isStart;
        if(isStart){
            points=InteractiveUtils.curveLayout(globalPoint,points[points.length-1]);
        }else{
            points=InteractiveUtils.curveLayout(points[0],globalPoint);
        }
        const updateData={} as Partial<OolongLineDO>;
        updateData.id=line.id;
        updateData.points=points;
        return updateData;
    }

    private _sendMsg(points: Point[], ctx: OolongEventContext) {
        const updateData = {} as Partial<OolongLineDO>;
        updateData.id = this.res!.line!.id;
        updateData.points = points;
        const updateLog = new UpdateLineLog(updateData);
        ctx.actionManager.execAction(updateLog);
    }

}