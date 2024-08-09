
import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import { Point } from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class LeftRightLayout implements ILineLayout {

    type=LineLayoutEnum.LeftRight;
    layout(start: ConnectorPoint, end: ConnectorPoint): Point[] {
        const points:Point[]=[];
        points.push(start);

        if(end.x<start.x){
            const p1=new Point(0.5*(start.x+end.x),start.y);
            points.push(p1);
            const p2=new Point(p1.x,end.y);
            points.push(p2);
            points.push(end);
            return points;
        }

        const p1=new Point(start.x-LinePadding,start.y);
        points.push(p1);
        const p2=new Point(p1.x,end.y-LinePadding);
        points.push(p2);
        const p3=new Point(end.x-LinePadding,p2.y);
        points.push(p3);
        points.push(new Point(p3.x,end.y));
        points.push(end);
        return points;
    }

}