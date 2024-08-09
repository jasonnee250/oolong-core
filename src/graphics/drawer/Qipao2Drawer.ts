import { GraphicNode, Point } from "dahongpao-core";
import { ISvgPointInfo } from "@/graphics/OolongSVGUtils.ts";
import { BaseCurvePolyDrawer } from "@/graphics/drawer/BaseCurvePolyDrawer";
import { Rect } from "@/text/base/Rect";
import { NodeTextPadding } from "@/text/config/OolongTextConstants";

const path: (Point | ISvgPointInfo)[] = [
    { x: 0.31000000000000005, y: 0.7932991831648899 },
    { x: 0.2874999999999999, y: 0.7683787899764641 },
    { x: 0.25, y: 0.7683787899764641 },
    { x: 0, y: 0.7683787899764641 },
    { x: 0, y: 0.5537865152983524 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 0.5537865152983524 },
    { x: 1, y: 0.7683787899764641 },
    { x: 0.75, y: 0.7683787899764641 },
    { x: 0.7125, y: 0.7683787899764641 },
    { x: 0.69, y: 0.7932991831648899 },
    {
        control1: { x: 0.69, y: 0.7932991831648899 },
        control2: { x: 0.5066666666666667, y: 0.996351931330472 },
        end: { x: 0.5066666666666667, y: 0.996351931330472 }
    },
    {
        control1: { x: 0.5033333333333333, y: 1 },
        control2: { x: 0.49333333333333335, y: 0.996351931330472 },
        end: { x: 0.49333333333333335, y: 0.996351931330472 }
    },
    { x: 0.31000000000000005, y: 0.7932991831648899 }
];
export class Qipao2Drawer extends BaseCurvePolyDrawer {

    constructor() {
        super(path);
    }

    textContentBounds(node: GraphicNode): Rect {
        return {
            x: node.x + NodeTextPadding,
            y: node.y + NodeTextPadding,
            width: node.w - 2 * NodeTextPadding,
            height: 0.7683787899764641 * node.h - 2 * NodeTextPadding,
        }
    }
}