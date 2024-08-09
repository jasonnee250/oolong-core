import {GraphicNode } from "dahongpao-core";
import {Rect} from "@/text/base/Rect.ts";
import {IDrawer} from "@/graphics/IDrawer.ts";

export class PureTextDrawer implements IDrawer {
    draw(node: GraphicNode, ctx: CanvasRenderingContext2D): void {
        if(node.color!=="none"){
            ctx.fillStyle = node.color;
            ctx.globalAlpha = node.alpha;
            ctx.fillRect(node.x, node.y, node.w, node.h);
        }
        return;
    }

    textContentBounds(node:GraphicNode):Rect{
        return {
            x:node.x+2,
            y:node.y+2,
            width:node.w-4,
            height:node.h-4,
        }
    }

}