import { GraphicNode, Point } from "dahongpao-core";
import { IDrawer } from "@/graphics/IDrawer";
import { Rect } from "@/text/base/Rect.ts";
import { NodeTextPadding } from "@/text/config/OolongTextConstants";

export class DoubleArrowDrawer implements IDrawer {
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
            { x: 0.6107819328373996, y: 0.2734780991883742 },
            { x: 0.6539511065938036, y: 0.2734780991883742 },
            { x: 0.6539511065938036, y: 0.21684864646169746 },
            { x: 0.6539511065938036, y: 0.004184287340360028 },
            { x: 0.6546322202241824, y: 0.0005493056914487859 },
            { x: 1, y: 0.4957965215673271 },
            { x: 1, y: 0.5041839727322893 },
            { x: 0.6623259263025459, y: 0.9999874156771719 },
            { x: 0.6539511065938036, y: 0.7831406568638987 },
            { x: 0.6539511065938036, y: 0.726511204137222 },
            { x: 0.6107819328373996, y: 0.726511204137222 },
            { x: 0.3892166281901421, y: 0.726511204137222 },
            { x: 0.34604745443373797, y: 0.726511204137222 },
            { x: 0.34604745443373797, y: 0.7831406568638987 },
            { x: 0.34604745443373797, y: 0.9957968361753979 },
            { x: 0.33767407369745417, y: 1 },
            { x: 0, y: 0.4958091058901553 },
            { x: 0.33767407369745417, y: 0 },
            { x: 0.34604745443373797, y: 0.21684864646169746 },
            { x: 0.34604745443373797, y: 0.2734780991883742 },
            { x: 0.3892166281901421, y: 0.2734780991883742 },
            { x: 0.6107819328373996, y: 0.2734780991883742 }
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
        const p1 = { x: 0, y: node.h / 2 };
        const p2 = { x: node.w * 0.33767407369745417, y: 0 };
        const k = (p1.y - p2.y) / (p1.x - p2.x);
        const b = node.h / 2;
        const y = 0.2734780991883742 * node.h;
        const x = (y - b) / k;
        const innerRect = {
            x,
            y,
            with: node.w - 2 * x,
            height: node.h - 2 * y
        }
        return {
            x: node.x + innerRect.x + NodeTextPadding,
            y: node.y + innerRect.y + NodeTextPadding,
            width: innerRect.with - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        }
    }

}