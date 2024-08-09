import {ConnectorPoint} from "@/graphics/ConnectorPoint";
import {Point} from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants";

export class RightRightLayout implements ILineLayout {

    type = LineLayoutEnum.RightRight;

    layout(start: ConnectorPoint, end: ConnectorPoint): Point[] {
        const points: Point[] = [];
        points.push(start);


        const p1 = new Point(end.x - LinePadding, start.y);
        points.push(p1);
        points.push(new Point(p1.x, end.y));
        points.push(end);
        return points;

    }

}