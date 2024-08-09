
import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import {GraphicNode, Point} from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class LeftLeftLayout implements ILineLayout {

    type=LineLayoutEnum.LeftLeft;
    layout(start: ConnectorPoint, end: ConnectorPoint,startNode?:GraphicNode,_endNode?:GraphicNode): Point[] {
        const points:Point[]=[];
        points.push(start);
        //上绕
        if(startNode && end.y<startNode.y){
            const p1=new Point(start.x-LinePadding,start.y);
            points.push(p1);
            const p2=new Point(p1.x,end.y);
            points.push(p2);
            points.push(end);
            return points;
        }else if(end.y<start.y){
            const p1=new Point(start.x-LinePadding,start.y);
            points.push(p1);
            const y=startNode?startNode.y-LinePadding:start.y-LinePadding;
            const p2=new Point(p1.x,y);
            points.push(p2);
            const p3=new Point(end.x-LinePadding,p2.y);
            points.push(p3);
            points.push(new Point(p3.x,end.y));
            points.push(end);
            return points;
        }else if(startNode && end.y<startNode.y+startNode.h){
            //下绕
            const p1=new Point(start.x-LinePadding,start.y);
            points.push(p1);
            const y=startNode?startNode.y+startNode.h+LinePadding:start.y+LinePadding;
            const p2=new Point(p1.x,y);
            points.push(p2);
            const p3=new Point(end.x-LinePadding,p2.y);
            points.push(p3);
            points.push(new Point(p3.x,end.y));
            points.push(end);
            return points;
        }else{
            const p1=new Point(start.x-LinePadding,start.y);
            points.push(p1);
            const p2=new Point(p1.x,end.y);
            points.push(p2);
            points.push(end);
            return points;
        }
    }

}