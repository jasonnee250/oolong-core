import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import { Point } from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class TopTopLayout implements ILineLayout {

    type=LineLayoutEnum.TopTop;
    layout(start: ConnectorPoint, end: ConnectorPoint): Point[] {
        const points:Point[]=[];
        points.push(start);
        const y=Math.min(start.y,end.y);
        const p1=new Point(start.x,y-LinePadding);
        points.push(p1);
        points.push(new Point(end.x,p1.y));
        points.push(end);
        return points;
    }

}