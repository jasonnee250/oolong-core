import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import {GraphicNode, Point} from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class TopRightLayout implements ILineLayout {

    type=LineLayoutEnum.TopRight;
    layout(start: ConnectorPoint, end: ConnectorPoint,startNode?:GraphicNode,endNode?:GraphicNode): Point[] {
        const points:Point[]=[];
        points.push(start);

        if(endNode && end.x>start.x){
            if(start.y>endNode.y+endNode.h+LinePadding){
                return this._layout1(start,end);
            }else{
                return this._layout2(start,end,endNode,startNode);
            }
        }
        if(end.y>start.y-LinePadding){
            return this._layout4(start, end,startNode);
        }
        return this._layout3(start, end);
    }

    _layout1(start: ConnectorPoint, end: ConnectorPoint):Point[]{
        //有节点，右侧下绕
        const points:Point[]=[];
        points.push(start);
        const p1=new Point(start.x,start.y-LinePadding);
        points.push(p1);
        const p2=new Point(end.x+LinePadding,p1.y);
        points.push(p2);
        const p3=new Point(p2.x,end.y);
        points.push(p3);
        points.push(end);
        return points;
    }

    _layout2(start: ConnectorPoint, end: ConnectorPoint,endNode:GraphicNode,startNode?:GraphicNode):Point[]{
        //有节点，右侧上绕
        const points:Point[]=[];
        points.push(start);
        let p1:Point;
        if(startNode){
            const y=Math.min(startNode.y,endNode.y);
            p1=new Point(start.x,y-LinePadding);
        }else{
            p1=new Point(start.x,endNode.y-LinePadding);
        }
        points.push(p1);
        const p2=new Point(end.x+LinePadding,p1.y);
        points.push(p2);
        const p3=new Point(p2.x,end.y);
        points.push(p3);
        points.push(end);
        return points;
    }

    _layout3(start: ConnectorPoint, end: ConnectorPoint):Point[]{
        //简单绕法
        const points:Point[]=[];
        points.push(start);
        const p1=new Point(start.x,end.y);
        points.push(p1);
        points.push(end);
        return points;
    }

    _layout4(start: ConnectorPoint, end: ConnectorPoint,startNode?:GraphicNode):Point[]{
        //左侧，绕
        const points:Point[]=[];
        points.push(start);
        const p1=new Point(start.x,start.y-LinePadding);
        points.push(p1);
        let p2:Point;
        if(startNode){
            p2=new Point(0.5*(end.x+startNode.x),p1.y);
        }else{
            p2=new Point(0.5*(end.x+start.x),p1.y);
        }
        points.push(p2);
        points.push(new Point(p2.x,end.y));
        points.push(end);
        return points;
    }

}