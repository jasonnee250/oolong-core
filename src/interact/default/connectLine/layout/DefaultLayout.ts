import { ConnectorPoint } from "@/graphics/ConnectorPoint";
import { Point } from "dahongpao-core";
import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {InteractiveUtils} from "@/interact/InteractiveUtils";

export class DefaultLayout implements ILineLayout {

    type=LineLayoutEnum.Default;
    layout(start: ConnectorPoint, end: ConnectorPoint): Point[] {
        const points:Point[]=InteractiveUtils.layout(start,end);
        return points;
    }

}