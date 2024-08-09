import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {Point} from "dahongpao-core";
import {StartLog} from "@/action/log/common/StartLog";
import {OolongLineDO} from "@/file/OolongLineDO";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog";
import {EndLog} from "@/action/log/common/EndLog";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {CurveCPRes} from "@/interact/detector/CurveControlPointDetector";

export class DragCurvePointProcessor extends StreamProcessor{

    res:CurveCPRes|null=null;
    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        const detector=ctx.detectors.get(OolongDetectorEnum.CurveControlPoint);
        if(!detector||!detector.detect(event,ctx)){
            return;
        }
        const res=detector.result as CurveCPRes;
        this.res=res;
        ctx.actionManager.execAction(new StartLog());

    }
    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        if(!this.res){
            return;
        }
        const line=this.res.line;
        const points=line.points;
        const start=points[0];
        const end=points[points.length-1];
        const p=event.globalPoint;
        const p1=new Point(p.x,start.y);
        const p2y=2*p.y-p1.y;
        const p2=new Point(p.x,p2y);
        const updateData={} as Partial<OolongLineDO>;
        updateData.id=line.id;
        updateData.points=[start,p1,p,p2,end];
        const updateLog=new UpdateLineLog(updateData);
        ctx.actionManager.execAction(updateLog);

    }
    onUp(_event: InteractiveEvent, ctx: OolongEventContext): void {
        if(!this.res){
            return;
        }
        ctx.actionManager.execAction(new EndLog());
        this.res = null;
        ctx.toolManager.resetTool();
    }

}