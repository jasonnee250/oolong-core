
import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import { Point } from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class BottomRightLayout implements ILineLayout {

    type=LineLayoutEnum.BottomRight;
    layout(start: ConnectorPoint, end: ConnectorPoint): Point[] {
        const points:Point[]=[];
        points.push(start);
        if(end.y>start.y+LinePadding){
            const p1=new Point(start.x,end.y);
            points.push(p1);
            points.push(end);
            return points;
        }
        const p1=new Point(start.x,start.y+LinePadding);
        points.push(p1);
        const p2=new Point(end.x,p1.y);
        points.push(p2);
        points.push(end);
        return points;
    }

}