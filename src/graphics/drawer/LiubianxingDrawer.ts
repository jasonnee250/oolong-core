import {GraphicNode, Point} from "dahongpao-core";
import {IDrawer} from "@/graphics/IDrawer";
import {Rect} from "@/text/base/Rect.ts";
import {NodeTextPadding} from "@/text/config/OolongTextConstants.ts";

export class LiubianxingDrawer implements IDrawer {
    draw(node: GraphicNode, ctx: CanvasRenderingContext2D): void {
        if (node.color === "none" && node.borderColor === "none") {
            return;
        }
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.alpha;
        ctx.strokeStyle = node.borderColor;
        ctx.lineWidth = node.borderWidth;
        ctx.globalAlpha = node.borderAlpha;
        ctx.beginPath();

        const path: Point[] = [
            { x: 1, y: 0.5 },
            { x: 0.75, y: 1 },
            { x: 0.25, y: 1 },
            { x: 0, y: 0.5 },
            { x: 0.25, y: 0 },
            { x: 0.75, y: 0 }
        ]

        ctx.moveTo(node.x+node.w*path[0].x, node.y+node.h*path[0].y);
        for(let i=1;i<path.length;i++){
            const p=path[i];
            ctx.lineTo(node.x+node.w*p.x, node.y+node.h*p.y);
        }
        ctx.closePath();

        if(node.color!=="none"){
            ctx.fill();
        }
        if(node.borderColor!=="none"){
            ctx.stroke();
        }
    }

    textContentBounds(node:GraphicNode): Rect {
        return {
            x:node.x+0.25*node.w,
            y:node.y+NodeTextPadding,
            width:0.5*node.w,
            height:node.h-2*NodeTextPadding,
        }
    }

}