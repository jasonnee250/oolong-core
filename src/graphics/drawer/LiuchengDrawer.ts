import { GraphicNode, Point } from "dahongpao-core";
import { Rect } from "@/text/base/Rect.ts";
import { NodeTextPadding } from "@/text/config/OolongTextConstants.ts";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer.ts";

const path: Point[] = [
    { x: 0, y: 0 },
    { x: 0.8, y: 0 },
    { x: 1, y: 0.5 },
    { x: 0.8, y: 1 },
    { x: 0, y: 1 },
    { x: 0.2, y: 0.5 },
]
export class LiuchengDrawer extends BasePolyLineDrawer {

    constructor() {
        super(path);
    }

    textContentBounds(node: GraphicNode): Rect {
        return {
            x: node.x + 0.2 * node.w + NodeTextPadding,
            y: node.y + NodeTextPadding,
            width: (1 - 0.2 * 2) * node.w - NodeTextPadding * 2,
            height: node.h - 2 * NodeTextPadding,
        }
    }

}