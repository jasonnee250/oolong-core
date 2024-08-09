
import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import {GraphicNode, Point} from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class BottomBottomLayout implements ILineLayout {

    type=LineLayoutEnum.BottomBottom;
    layout(start: ConnectorPoint, end: ConnectorPoint,startNode?:GraphicNode): Point[] {
        const points:Point[]=[];
        points.push(start);

        if(end.y<start.y){
            if (startNode && end.x>startNode.x+startNode.w){
                const p1=new Point(start.x,start.y+LinePadding);
                points.push(p1);
                const p2=new Point(end.x,p1.y);
                points.push(p2);
                points.push(end);
                return points;
            }else if(startNode && end.x>start.x){
                //右绕
                const p1=new Point(start.x,start.y+LinePadding);
                points.push(p1);
                const p2=new Point(startNode.x+startNode.w+LinePadding,p1.y);
                points.push(p2);
                const p3=new Point(p2.x,0.5*(startNode.y+end.y));
                points.push(p3);
                const p4=new Point(end.x,p3.y);
                points.push(p4);
                points.push(end);
                return points;
            }else if(startNode && end.x>startNode.x){
                //左绕
                const p1=new Point(start.x,start.y+LinePadding);
                points.push(p1);
                const p2=new Point(startNode.x-LinePadding,p1.y);
                points.push(p2);
                const p3=new Point(p2.x,0.5*(startNode.y+end.y));
                points.push(p3);
                const p4=new Point(end.x,p3.y);
                points.push(p4);
                points.push(end);
                return points;
            }else{
                const p1=new Point(start.x,start.y+LinePadding);
                points.push(p1);
                const p2=new Point(end.x,p1.y);
                points.push(p2);
                points.push(end);
                return points;
            }
        }

        const y=Math.max(start.y,end.y);
        const p1=new Point(start.x,y+LinePadding);
        points.push(p1);
        const p2=new Point(end.x,p1.y);
        points.push(p2);
        points.push(end);
        return points;
    }

}