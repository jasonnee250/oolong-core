
import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import {GraphicNode, Point} from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class LeftBottomLayout implements ILineLayout {

    type=LineLayoutEnum.LeftBottom;
    layout(start: ConnectorPoint, end: ConnectorPoint,startNode?:GraphicNode): Point[] {
        const points:Point[]=[];
        points.push(start);

        if(start.y>end.y){
            if(start.x>end.x){
                const p1=new Point(end.x,start.y);
                points.push(p1);
                points.push(end);
                return points;
            }else{
                const p1=new Point(start.x-LinePadding,start.y);
                points.push(p1);
                const p2=new Point(p1.x,0.5*(end.y+start.y));
                points.push(p2);
                const p3=new Point(end.x,p2.y);
                points.push(p3);
                points.push(end);
                return points;
            }
        }

        const p1=new Point(start.x-LinePadding,start.y);
        points.push(p1);
        const p2=new Point(p1.x,end.y-LinePadding);
        points.push(p2);
        const p3=new Point(end.x,p2.y);
        points.push(p3);
        points.push(end);
        return points;
    }

}