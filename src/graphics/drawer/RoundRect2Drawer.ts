import {IDrawer} from "@/graphics/IDrawer";
import {GraphicNode} from "dahongpao-core";
import {Rect} from "@/text/base/Rect.ts";
import {NodeTextPadding} from "@/text/config/OolongTextConstants.ts";

export class RoundRect2Drawer implements IDrawer{

    draw(node: GraphicNode, ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.alpha;
        ctx.strokeStyle = node.borderColor;
        ctx.lineWidth = node.borderWidth;
        ctx.globalAlpha = node.borderAlpha;

        const r=node.h>node.w?0.5*node.w:0.5*node.h;

        ctx.roundRect(node.x, node.y, node.w, node.h,r);

        if(node.color!=="none"){
            ctx.fill();
        }
        if(node.borderColor!=="none"&& Math.abs(node.borderAlpha)>1e-3){
            ctx.stroke();
        }
        ctx.restore();
    }

    textContentBounds(node:GraphicNode):Rect{
        const r=node.h>node.w?0.5*node.w:0.5*node.h;
        const y = r / 2;
        const a = r;
        const b = r;
        const x = a - Math.sqrt(r ** 2 - (y - b) ** 2);
        const innerRect = {
            x,
            y,
            width: node.w - x * 2,
            height: node.h - y * 2,
        }
        return {
            x: node.x + innerRect.x + NodeTextPadding,
            y: node.y + innerRect.y + NodeTextPadding,
            width: innerRect.width - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        };
    }
}