import { Rect } from "@/text/base/Rect";
import { GraphicNode, Point } from "dahongpao-core";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer";
import { NodeTextPadding } from "@/text/config/OolongTextConstants";

const path: Point[] = [
    { x: 0.5, y: 0 },
    { x: 1, y: 0.5 },
    { x: 0.5, y: 1 },
    { x: 0, y: 0.5 },
];
export class LingxingDrawer extends BasePolyLineDrawer {

    constructor() {
        super(path);
    }
    textContentBounds(node: GraphicNode): Rect {
        const p1 = { x: 0, y: node.h / 2 };
        const p2 = { x: node.w / 2, y: 0 };
        const k = (p1.y - p2.y) / (p1.x - p2.x);
        const b = p1.y;
        const x = 0.25 * node.w;
        const y = k * x + b;
        const innerRect = {
            x,
            y,
            with: node.w - x * 2,
            height: node.h - y * 2,
        }
        return {
            x: node.x + innerRect.x + NodeTextPadding,
            y: node.y + innerRect.y + NodeTextPadding,
            width: innerRect.with - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        }
    }

}