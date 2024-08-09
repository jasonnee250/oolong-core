import { GraphicNode } from "dahongpao-core";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer";
import { Rect } from "@/text/base/Rect";
import { NodeTextPadding } from "@/text/config/OolongTextConstants";

const rightArrowConfig = [
    { x: 0, y: 0.2 },
    { x: 0.5, y: 0.2 },
    { x: 0.5, y: 0 },
    { x: 1, y: 0.5 },
    { x: 0.5, y: 1 },
    { x: 0.5, y: 0.8 },
    { x: 0, y: 0.8 },
];
export class RightArrowDrawer extends BasePolyLineDrawer {

    constructor() {
        super(rightArrowConfig);
    }

    textContentBounds(node: GraphicNode): Rect {
        const p1 = { x: 0, y: node.h / 2 };
        const p2 = { x: node.w / 2, y: 0 };
        const k = (p1.y - p2.y) / (p1.x - p2.x);
        const b = node.h / 2;
        const y = 0.2 * node.h;
        const x = (y - b) / k;
        const innerRect = {
            x: 0,
            y,
            with: node.w - x,
            height: node.h - 2 * y,
        }
        return {
            x: node.x + innerRect.x + NodeTextPadding,
            y: node.y + innerRect.y + NodeTextPadding,
            width: innerRect.with - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        }
    }

}