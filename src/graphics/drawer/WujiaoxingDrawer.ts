import { Rect } from "@/text/base/Rect";
import { GraphicNode } from "dahongpao-core";
import { BasePolyLineDrawer } from "@/graphics/drawer/BasePolyLineDrawer";
import { wujiaoxingConfig } from "@/graphics/drawer/ShapeConfig";
import { NodeTextPadding } from "@/text/config/OolongTextConstants";

export class WujiaoxingDrawer extends BasePolyLineDrawer {

    constructor() {
        super(wujiaoxingConfig);
    }
    textContentBounds(node: GraphicNode): Rect {
        const p1 = { x: node.w * 0.059751494008607714, y: node.h * 0.3413412114782689 };
        const p2 = { x: node.w * 0.3046116827074003, y: node.h * 0.3039298761896317 };
        const k = (p1.y - p2.y) / (p1.x - p2.x);
        const b = p1.y;
        const x = 0.22595074339910845 * node.w;
        const y = k * x + b;
        const innerRect = {
            x,
            y,
            with: node.w - x * 2,
            height: node.h * 0.849438315417013 - y,
        }
        return {
            x: node.x + innerRect.x + NodeTextPadding,
            y: node.y + innerRect.y + NodeTextPadding,
            width: innerRect.with - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        }
    }
}