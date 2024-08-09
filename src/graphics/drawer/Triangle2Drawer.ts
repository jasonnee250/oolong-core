import { GraphicNode, Point } from "dahongpao-core";
import { Rect } from "@/text/base/Rect.ts";
import { NodeTextPadding } from "@/text/config/OolongTextConstants.ts";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer.ts";

const path: Point[] = [
    { x: 0, y: 1 },
    { x: 0.5, y: 0 },
    { x: 1, y: 1 },
]
export class Triangle2Drawer extends BasePolyLineDrawer {
    constructor() {
        super(path);
    }

    textContentBounds(node: GraphicNode): Rect {
        const x = node.w / 4;
        const k = - node.h / (node.w / 2);
        const b = node.h;
        const y = k * x + b;
        const innerRect = {
            x: x,
            y: y,
            width: node.w / 2,
            height: node.h - y,
        };
        return {
            x: node.x + innerRect.x + NodeTextPadding,
            y: node.y + innerRect.y + NodeTextPadding,
            width: innerRect.width - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        }
    }

}