import {IDrawer} from "@/graphics/IDrawer";
import {GraphicNode, IGraphicElement} from "dahongpao-core";
import {Rect} from "@/text/base/Rect";
import {NodeTextPadding} from "@/text/config/OolongTextConstants";

export abstract class AbsDrawer implements IDrawer{
    abstract draw(node:IGraphicElement,ctx:CanvasRenderingContext2D):void;

    textContentBounds(node:GraphicNode):Rect{
        return {
            x:node.x+NodeTextPadding,
            y:node.y+NodeTextPadding,
            width:node.w-2*NodeTextPadding,
            height:node.h-2*NodeTextPadding,
        }
    }
}