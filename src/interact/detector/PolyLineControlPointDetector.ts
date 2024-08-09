import {AbsDetector, InteractiveEvent} from "dahongpao-canvas";
import {GraphicUtils, Point} from "dahongpao-core";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongLine} from "@/graphics/OolongLine";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants.ts";

export interface ControlPointRes{
    controlPoint:Point;
    lPointIndex:number;
    rPointIndex:number;
    isHorizon:boolean;
    line:OolongLine;
}
export class PolyLineControlPointDetector extends AbsDetector<ControlPointRes>{
    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const selectNodes=ctx.auxiliaryManager.selectManager.selectNodes;
        if(selectNodes.size===0){
            return false;
        }
        const selectNode=[...selectNodes][0];
        if(selectNode instanceof OolongLine){
            if(selectNode.shapeType!==OolongLineType.PolyLine){
                return false;
            }
            const points=selectNode.points;
            for(let i=0;i < points.length-1;i++){
                const p=points[i];
                const q=points[i+1];
                const distance=GraphicUtils.distance(p,q);
                if(distance<LinePadding){
                    continue;
                }
                const cp=new Point(0.5*(p.x+q.x),0.5*(p.y+q.y));
                const res=GraphicUtils.circleContains(event.globalPoint,cp,8);
                const isHorizon=InteractiveUtils.judgeHorizon(p,q);
                if(res){
                    this.result={
                        controlPoint:cp,
                        lPointIndex:i,
                        rPointIndex:i+1,
                        line:selectNode,
                        isHorizon,
                    }
                    return true;
                }
            }
        }

        return false;
    }

}