import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import {GraphicNode, Point} from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {InteractiveUtils} from "@/interact/InteractiveUtils";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants.ts";

export class RightLeftLayout implements ILineLayout {

    type=LineLayoutEnum.RightLeft;
    layout(start: ConnectorPoint, end: ConnectorPoint,startNode?:GraphicNode,endNode?:GraphicNode): Point[] {
        const points:Point[]=[];
        points.push(start);
        //水平线判定
        if(InteractiveUtils.judgeHorizon(start,end)){
            points.push(end);
            return points;
        }
        if(end.x>start.x){
            const p1=new Point(0.5*(start.x+end.x),start.y);
            points.push(p1);
            points.push(new Point(p1.x,end.y))
            points.push(end);
            return points;
        }
        //绕
        const p1=new Point(start.x+LinePadding,start.y);
        points.push(p1);
        const y=endNode?0.5*(startNode!.y+endNode.y+endNode.h):0.5*(startNode!.y+end.y);
        const p2=new Point(p1.x,y);
        points.push(p2);
        const p3=new Point(end.x-LinePadding,p2.y);
        points.push(p3);
        const p4=new Point(p3.x,end.y);
        points.push(p4);
        points.push(end);
        return points;
    }

}