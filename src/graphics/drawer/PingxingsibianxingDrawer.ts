import { GraphicNode, Point } from "dahongpao-core";
import { Rect } from "@/text/base/Rect.ts";
import { NodeTextPadding } from "@/text/config/OolongTextConstants.ts";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer.ts";

const path: Point[] = [
    { x: 0.16, y: 0 },
    { x: 1, y: 0 },
    { x: 0.84, y: 1 },
    { x: 0, y: 1 },

]
export class PingxingsibianxingDrawer extends BasePolyLineDrawer {

    constructor() {
        super(path);
    }

    textContentBounds(node: GraphicNode): Rect {
        return {
            x: node.x + 0.16 * node.w + NodeTextPadding,
            y: node.y + NodeTextPadding,
            width: (1 - 0.16 * 2) * node.w - 2 * NodeTextPadding,
            height: node.h - 2 * NodeTextPadding,
        }
    }

}