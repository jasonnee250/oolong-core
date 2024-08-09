import { AbsDrawer } from "@/graphics/drawer/AbsDrawer";
import { Rect } from "@/text/base/Rect";
import { GraphicNode } from "dahongpao-core";

export class RoundRectDrawer extends AbsDrawer {
    draw(node: GraphicNode, ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.alpha;
        ctx.strokeStyle = node.borderColor;
        ctx.lineWidth = node.borderWidth;
        ctx.globalAlpha = node.borderAlpha;
        ctx.roundRect(node.x, node.y, node.w, node.h, 10);

        if (node.color !== "none") {
            ctx.fill();
        }
        if (node.borderColor !== "none" && Math.abs(node.borderAlpha) > 1e-3) {
            ctx.stroke();
        }
        ctx.restore();
    }

    textContentBounds(node: GraphicNode): Rect {
        const padding = 10;
        return {
            x: node.x + padding,
            y: node.y + padding,
            width: node.w - 2 * padding,
            height: node.h - 2 * padding,
        }
    }
}