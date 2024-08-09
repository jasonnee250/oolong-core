import { Rect } from "@/text/base/Rect";
import { GraphicNode } from "dahongpao-core";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer";
import { NodeTextPadding } from "@/text/config/OolongTextConstants";

const wubianxingConfig = [
    { x: 0.5000000000000001, y: 0 },
    { x: 1, y: 0.38196601125010515 },
    { x: 0.8090169943749473, y: 1 },
    { x: 0.1909830056250526, y: 1 },
    { x: 0, y: 0.381966011250105 }
]
export class WubianxingDrawer extends BasePolyLineDrawer {

    constructor() {
        super(wubianxingConfig);
    }
    textContentBounds(node: GraphicNode): Rect {
        const p1 = { x: 0, y: node.h * 0.38196601125010515 };
        const p2 = { x: node.w / 2, y: 0 };
        const k = (p1.y - p2.y) / (p1.x - p2.x);
        const b = p1.y;
        const x = 0.1909830056250526 * node.w;
        const y = k * x + b;
        const innerRect = {
            x,
            y,
            with: node.w - x * 2,
            height: node.h - y,
        }
        return {
            x: node.x + innerRect.x + NodeTextPadding,
            y: node.y + innerRect.y + NodeTextPadding,
            width: innerRect.with - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        }
    }

}