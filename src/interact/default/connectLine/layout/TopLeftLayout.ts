import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import { Point } from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class TopLeftLayout implements ILineLayout {

    type=LineLayoutEnum.TopLeft;
    layout(start: ConnectorPoint, end: ConnectorPoint): Point[] {
        const points:Point[]=[];
        points.push(start);
        if(end.y<start.y){
            const p1=new Point(start.x,end.y);
            points.push(p1);
            points.push(end);
            return points;
        }
        const p1=new Point(start.x,start.y-LinePadding);
        points.push(p1);
        const p2=new Point(0.5*(start.x+end.x),p1.y);
        points.push(p2);
        const p3=new Point(p2.x,end.y);
        points.push(p3);
        points.push(end);
        return points;
    }

}