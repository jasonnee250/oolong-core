import { Rect } from "@/text/base/Rect";
import { NodeTextPadding } from "@/text/config/OolongTextConstants";
import { IDrawer } from "@/graphics/IDrawer.ts";
import { GraphicNode, Point } from "dahongpao-core";

export class RightKuohaoDrawer implements IDrawer {


    path1: any[] = [
        {
            start: { x: 0.21052631578947367, y: 0.6666666666666666 },
            control1: { x: 0.21052631578947367, y: 0.6027166666666667 },
            control2: { x: 0.24304894736842106, y: 0.5436888888888889 },
            end: { x: 0.2957073684210526, y: 0.5120611111111111 }
        },
        { x: 0.3157894736842105, y: 0.5 },
        {
            start: { x: 0.2957073684210526, y: 0.48793888888888887 },
            control1: { x: 0.24304894736842106, y: 0.4563111111111111 },
            control2: { x: 0.21052631578947367, y: 0.3972833333333333 },
            end: { x: 0.21052631578947367, y: 0.3333333333333333 }
        },
        { x: 0.21052631578947367, y: 0.3333333333333333 },
        {
            start: { x: 0.21052631578947367, y: 0.2222222222222222 },
            control1: { x: 0.21052631578947367, y: 0.09949222222222225 },
            control2: { x: 0.11627052631578945, y: 0 },
            end: { x: 0, y: 0 }
        },
        { x: 0, y: 0 },
    ]

    startP: Point = { x: 0.21052631578947367, y: 0.6666666666666666 };

    path2: any[] = [
        {
            start: { x: 0.21052631578947367, y: 0.7777777777777778 },
            control1: { x: 0.21052631578947367, y: 0.9005055555555556 },
            control2: { x: 0.11627052631578945, y: 1 },
            end: { x: 0, y: 1 }
        }];
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


        this.travelPath(this.path1, node, ctx);
        ctx.moveTo(node.x + node.w * this.startP.x, node.y + node.h * this.startP.y);
        this.travelPath(this.path2, node, ctx);

        if (node.color !== "none") {
            ctx.fill();
        }
        if (node.borderColor !== "none") {
            ctx.stroke();
        }
    }

    textContentBounds(node: any): Rect {
        return {
            x: node.x + node.w * 0.3157894736842105 + NodeTextPadding,
            y: node.y + NodeTextPadding,
            width: (1 - 0.3157894736842105) * node.w - NodeTextPadding * 2,
            height: node.h - 2 * NodeTextPadding,
        }
    }

    travelPath(path: any, node: GraphicNode, ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < path.length; i++) {
            const p = path[i];
            if (p.end) {
                ctx.lineTo(node.x + node.w * p.start.x, node.y + node.h * p.start.y);
                ctx.bezierCurveTo(node.x + node.w * p.control1.x, node.y + node.h * p.control1.y,
                    node.x + node.w * p.control2.x, node.y + node.h * p.control2.y,
                    node.x + node.w * p.end.x, node.y + node.h * p.end.y);
            } else {
                ctx.lineTo(node.x + node.w * p.x, node.y + node.h * p.y);
            }
        }
    }

}