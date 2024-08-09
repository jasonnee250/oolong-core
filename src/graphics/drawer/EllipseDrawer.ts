import { GraphicNode } from "dahongpao-core";
import { AbsDrawer } from "@/graphics/drawer/AbsDrawer.ts";
import { Rect } from "@/text/base/Rect";
import { NodeTextPadding } from "@/text/config/OolongTextConstants";

export class EllipseDrawer extends AbsDrawer {
    draw(node: GraphicNode, ctx: CanvasRenderingContext2D): void {
        //border & color均为空
        if (node.color === "none" && node.borderColor === "none") {
            return;
        }
        //color为空
        if (node.color === "none" && node.borderColor !== "none") {
            ctx.strokeStyle = node.borderColor;
            ctx.lineWidth = node.borderWidth;
            ctx.globalAlpha = node.borderAlpha;
            ctx.beginPath();
            ctx.ellipse(node.x + 0.5 * node.w, node.y + 0.5 * node.h, 0.5 * node.w, 0.5 * node.h, 0, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.stroke();
            return;
        }
        //border为空
        if (node.color !== "none" && node.borderColor === "none") {
            ctx.fillStyle = node.color;
            ctx.globalAlpha = node.alpha;
            ctx.beginPath();
            ctx.ellipse(node.x + 0.5 * node.w, node.y + 0.5 * node.h, 0.5 * node.w, 0.5 * node.h, 0, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            return;
        }
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.alpha;
        ctx.beginPath();
        ctx.ellipse(node.x + 0.5 * node.w, node.y + 0.5 * node.h, 0.5 * node.w, 0.5 * node.h, 0, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.strokeStyle = node.borderColor;
        ctx.lineWidth = node.borderWidth;
        ctx.globalAlpha = node.borderAlpha;
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

    }

    textContentBounds(node: GraphicNode): Rect {
        // 计算椭圆内接矩形
        const width = node.w * Math.sqrt(2) / 2;
        const padding = (node.w - width) / 2;
        const a = Math.max(node.w , node.h) / 2;
        const b = Math.min(node.w , node.h) / 2;
        const m = (1 - ((width / 2) ** 2) / (a ** 2)) * (b **2);
        const innerRect = {
            x: node.x + padding,
            y: node.y + node.h / 2 - Math.sqrt(m),
            width,
            height: 2 * Math.sqrt(m),
        };
 
        return {
            x: innerRect.x + NodeTextPadding,
            y: innerRect.y + NodeTextPadding,
            width: innerRect.width - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        };
    }
}