import {ConnectorPoint} from "@/graphics/ConnectorPoint";
import {GraphicNode, Point} from "dahongpao-core";

export enum LineLayoutEnum{
    LeftLeft="LeftLeft",
    LeftTop="LeftTop",
    LeftRight="LeftRight",
    LeftBottom="LeftBottom",
    TopLeft="TopLeft",
    TopTop="TopTop",
    TopRight="TopRight",
    TopBottom="TopBottom",
    RightLeft="RightLeft",
    RightTop="RightTop",
    RightRight="RightRight",
    RightBottom="RightBottom",
    BottomLeft="BottomLeft",
    BottomTop="BottomTop",
    BottomRight="BottomRight",
    BottomBottom="BottomBottom",
    Default="Default",
}

export interface ILineLayout {

    type:LineLayoutEnum;
    layout(start:ConnectorPoint,end:ConnectorPoint,startNode?:GraphicNode,endNode?:GraphicNode):Point[];

}