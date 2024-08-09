import {ConnectorPoint} from "@/graphics/ConnectorPoint";
import {GraphicNode, Point} from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class RightBottomLayout implements ILineLayout {

    type = LineLayoutEnum.RightBottom;

    layout(start: ConnectorPoint, end: ConnectorPoint,startNode?:GraphicNode): Point[] {
        const points: Point[] = [];
        points.push(start);

        if(end.y<start.y){
            if(end.x>start.x){
                points.push(new Point(end.x,start.y));
                points.push(end);
                return points;
            }else{
                const p1 = new Point(start.x+LinePadding, start.y);
                points.push(p1);
                const p2=new Point(p1.x, 0.5*(end.y+start.y));
                points.push(p2);
                const p3=new Point(end.x,p2.y);
                points.push(p3);
                points.push(end);
                return points;
            }

        }
        let p1:Point;
        if(startNode && end.x<start.x){
            p1 = new Point(startNode.x+startNode.w+LinePadding, start.y);
        }else{
            p1 = new Point(0.5*(start.x+end.x), start.y);
        }
        points.push(p1);
        const p2=new Point(p1.x, end.y+LinePadding);
        points.push(p2);
        points.push(new Point(end.x,p2.y));
        points.push(end);
        return points;

    }

}