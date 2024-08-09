import { GraphicNode, Point } from "dahongpao-core";
import { IDrawer } from "@/graphics/IDrawer";
import { Rect } from "@/text/base/Rect.ts";
import { NodeTextPadding } from "@/text/config/OolongTextConstants.ts";

export class BabianxingDrawer implements IDrawer {
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
            { x: 1.0, y: 0.5 },
            { x: 0.935375, y: 0.935375 },
            { x: 0.5, y: 1.0 },
            { x: 0.064625, y: 0.935375 },
            { x: 0.0, y: 0.5 },
            { x: 0.064625, y: 0.064625 },
            { x: 0.5, y: 0.0 },
            { x: 0.935375, y: 0.064625 }
        ]
        ctx.moveTo(node.x + node.w * path[0].x, node.y + node.h * path[0].y);
        for (let i = 1; i < path.length; i++) {
            const p = path[i];
            ctx.lineTo(node.x + node.w * p.x, node.y + node.h * p.y);
        }
        ctx.closePath();

        if (node.color !== "none") {
            ctx.fill();
        }
        if (node.borderColor !== "none") {
            ctx.stroke();
        }
    }

    textContentBounds(node: GraphicNode): Rect {
        const innerRect = {
            x: 0.064625 * node.w,
            y: 0.064625 * node.h,
            width: node.w * (1 - 0.064625 * 2),
            height: node.h * (1 - 0.064625 * 2),
        }
        return {
            x: node.x + innerRect.x + NodeTextPadding,
            y: node.y + innerRect.y + NodeTextPadding,
            width: innerRect.width - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        }
    }

}