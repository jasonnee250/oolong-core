import {AbsDetector, InteractiveEvent} from "dahongpao-canvas";
import {GraphicUtils, Point} from "dahongpao-core";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongLine} from "@/graphics/OolongLine";

export interface LineEndRes{
    endPoint:Point;
    isStart:boolean;
    line:OolongLine;
}
export class LineEndPointDetector extends AbsDetector<LineEndRes>{
    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const selectNodes=ctx.auxiliaryManager.selectManager.selectNodes;
        if(selectNodes.size===0){
            return false;
        }
        const selectNode=[...selectNodes][0];
        if(selectNode instanceof OolongLine){
            const points=selectNode.points;
            const start=points[0];
            const end=points[points.length-1];
            let res=GraphicUtils.circleContains(event.globalPoint,start,8);
            if(res){
                this.result={
                    endPoint:start,
                    isStart:true,
                    line:selectNode,
                }
                return true;
            }
            res=GraphicUtils.circleContains(event.globalPoint,end,8);
            if(res){
                this.result={
                    endPoint:end,
                    isStart:false,
                    line:selectNode,
                }
                return true;
            }
        }
        return false;
    }

}