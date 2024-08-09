import {AbsDetector, InteractiveEvent} from "dahongpao-canvas";
import {GraphicUtils, Point} from "dahongpao-core";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongLine} from "@/graphics/OolongLine";
import {OolongLineType} from "@/graphics/OolongLineType.ts";

export interface CurveCPRes{
    controlPoint:Point;
    lPointIndex:number;
    rPointIndex:number;
    line:OolongLine;
}
export class CurveControlPointDetector extends AbsDetector<CurveCPRes>{
    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const selectNodes=ctx.auxiliaryManager.selectManager.selectNodes;
        if(selectNodes.size===0){
            return false;
        }
        const selectNode=[...selectNodes][0];
        if(selectNode instanceof OolongLine){
            if(selectNode.shapeType!==OolongLineType.Curve){
                return false;
            }
            const points=selectNode.points;
            for(let i=2;i < points.length-1;i=i+2){
                const p=points[i];
                const res=GraphicUtils.circleContains(event.globalPoint,p,8);
                if(res){
                    this.result={
                        controlPoint:p,
                        lPointIndex:i,
                        rPointIndex:i+1,
                        line:selectNode,
                    }
                    return true;
                }
            }
        }
        return false;
    }

}