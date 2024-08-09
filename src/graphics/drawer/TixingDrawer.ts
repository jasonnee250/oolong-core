import { Rect } from "@/text/base/Rect";
import { GraphicNode } from "dahongpao-core";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer";
import { NodeTextPadding } from "@/text/config/OolongTextConstants";

const tixingConfig = [
    { x: 0.2, y: 0 },
    { x: 0.8, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
];
export class TixingDrawer extends BasePolyLineDrawer {

    constructor() {
        super(tixingConfig);
    }
    textContentBounds(node: GraphicNode): Rect {
        return {
            x: node.x + 0.2 * node.w,
            y: node.y + NodeTextPadding,
            width: (0.6) * node.w,
            height: node.h - 2 * NodeTextPadding,
        }
    }

}