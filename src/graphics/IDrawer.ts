import {GraphicNode, IGraphicElement} from "dahongpao-core";
import {Rect} from "@/text/base/Rect.ts";

export interface IDrawer {

    draw(node:IGraphicElement,ctx:CanvasRenderingContext2D):void;

    textContentBounds(node:GraphicNode):Rect;
}