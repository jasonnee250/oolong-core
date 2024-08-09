import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import {GraphicNode, Point} from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class RightTopLayout implements ILineLayout {

    type=LineLayoutEnum.RightTop;
    layout(start: ConnectorPoint, end: ConnectorPoint,startNode?:GraphicNode,endNode?:GraphicNode): Point[] {
        const points:Point[]=[];
        points.push(start);
        if(startNode && end.y<startNode.y+startNode.h){
            const p1=new Point(start.x+LinePadding,start.y);
            points.push(p1);
            let p2:Point;
            if(endNode){
                const y=Math.min(startNode.y,endNode.y)
                p2=new Point(p1.x,y-LinePadding);
            }else{
                p2=new Point(p1.x,startNode.y-LinePadding);
            }
            points.push(p2);
            points.push(new Point(end.x,p2.y));
            points.push(end);
            return points;
        }
        if(end.y>start.y){
            if(end.x>start.x){
                const p1=new Point(end.x,start.y);
                points.push(p1);
                points.push(end);
                return points;
            }else{
                const p1=new Point(start.x+LinePadding,start.y);
                points.push(p1);
                const p2=new Point(p1.x,0.5*(end.y+start.y));
                points.push(p2);
                const p3=new Point(end.x,p2.y);
                points.push(p3);
                points.push(end);
                return points;
            }
        }

        if(endNode && start.x+LinePadding>endNode.x){
            const p1=new Point(endNode.x+endNode.w+LinePadding,start.y);
            points.push(p1);
            const p2=new Point(p1.x,end.y-LinePadding);
            points.push(p2);
            points.push(new Point(end.x,p2.y));
            points.push(end);
            return points;
        }

        let p1:Point;
        if(startNode){
            p1=new Point(start.x+LinePadding,start.y);
        }else{
            p1=new Point(0.5*(start.x+end.x),start.y);
        }
        points.push(p1);
        const p2=new Point(p1.x,end.y-LinePadding);
        points.push(p2);
        points.push(new Point(end.x,p2.y));
        points.push(end);
        return points;
    }

}