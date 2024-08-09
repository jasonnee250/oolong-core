import { GraphicNode, Point } from "dahongpao-core";
import { Rect } from "@/text/base/Rect.ts";
import { NodeTextPadding } from "@/text/config/OolongTextConstants.ts";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer.ts";


const path: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
];
export class TriangleDrawer extends BasePolyLineDrawer {

    constructor() {
        super(path);
    }
    textContentBounds(node: GraphicNode): Rect {
        const y = node.h / 2;
        const k = node.h / node.w;
        const innerRect = {
            x: 0,
            y: y,
            width: y / k,
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