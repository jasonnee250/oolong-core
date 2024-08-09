import { GraphicNode, Point } from "dahongpao-core";
import { Rect } from "@/text/base/Rect.ts";
import { NodeTextPadding } from "@/text/config/OolongTextConstants.ts";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer";

const delta = 0.2;

const path: Point[] = [
    { x: 0, y: delta },
    { x: delta, y: delta },
    { x: delta, y: 0 },
    { x: 1 - delta, y: 0 },
    { x: 1 - delta, y: delta },
    { x: 1, y: delta },
    { x: 1, y: 1 - delta },
    { x: 1 - delta, y: 1 - delta },
    { x: 1 - delta, y: 1 },
    { x: delta, y: 1 },
    { x: delta, y: 1 - delta },
    { x: 0, y: 1 - delta },
]
export class ShiziDrawer extends BasePolyLineDrawer {

    constructor() {
        super(path);
    }

    textContentBounds(node: GraphicNode): Rect {
        return {
            x: node.x + node.w * delta + NodeTextPadding,
            y: node.y + node.h * delta + NodeTextPadding,
            width: node.w * (1 - delta * 2) - NodeTextPadding * 2,
            height: node.h * (1 - delta * 2) - NodeTextPadding * 2,
        }
    }
}