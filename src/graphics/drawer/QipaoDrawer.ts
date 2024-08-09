import {GraphicNode, Point} from "dahongpao-core";
import {ISvgPointInfo} from "@/graphics/OolongSVGUtils.ts";
import {Rect} from "@/text/base/Rect.ts";
import {NodeTextPadding} from "@/text/config/OolongTextConstants.ts";
import {BaseCurvePolyDrawer} from "@/graphics/drawer/BaseCurvePolyDrawer.ts";

const path: (Point|ISvgPointInfo)[] = [
    { x: 1, y: 0.45793452181316274 },
    {
        control1: { x: 1, y: 0.6994272593586337 },
        control2: { x: 0.787010989010989, y: 0.9158690436263256 },
        end: { x: 0.4999999999999999, y: 0.9158690436263256 }
    },
    {
        control1: { x: 0.46639010989010976, y: 0.9158690436263256 },
        control2: { x: 0.433598901098901, y: 0.9128182967415703 },
        end: { x: 0.40191758241758235, y: 0.907019942725936 }
    },
    {
        control1: { x: 0.37824615384615373, y: 0.9026921390057018 },
        control2: { x: 0.3528615384615384, y: 0.9035048115373702 },
        end: { x: 0.3279280219780219, y: 0.9121152705038569 }
    },
    { x: 0.11784450549450547, y: 0.9846495188462631 },
    {
        control1: { x: 0.07337472527472529, y: 1 },
        control2: { x: 0.03134010989010989, y: 0.9532971285570547 },
        end: { x: 0.041957142857142846, y: 0.9003315187946649 }
    },
    { x: 0.06358351648351648, y: 0.7924395655426847 },
    {
        control1: { x: 0.07454010989010991, y: 0.7377776631149868 },
        control2: { x: 0.0627230769230769, y: 0.6843734681767757 },
        end: { x: 0.04232032967032968, y: 0.6421015969660225 }
    },
    {
        control1: { x: 0.01492857142857143, y: 0.58534351538918 },
        control2: { x: 0, y: 0.5230966693325766 },
        end: { x: 0, y: 0.45793452181316274 }
    },
    {
        control1: { x: 0, y: 0.21644242924589152 },
        control2: { x: 0.21299010989010986, y: 0 },
        end: { x: 0.4999999999999999, y: 0 }
    },
    {
        control1: { x: 0.787010989010989, y: 0 },
        control2: { x: 1, y: 0.21644242924589152 },
        end: { x: 1, y: 0.45793452181316274 }
    }
]
export class QipaoDrawer extends BaseCurvePolyDrawer {

    constructor() {
        super(path);
    }

    textContentBounds(node:GraphicNode): Rect {
        // 计算椭圆内接矩形
        const width = node.w * Math.sqrt(2) / 2;
        const padding = (node.w - width) / 2;
        const a = Math.max(node.w , node.h) / 2;
        const b = Math.min(node.w , node.h) / 2;
        const m = (1 - ((width / 2) ** 2) / (a ** 2)) * (b **2);
        const innerRect = {
            x: node.x + padding,
            y: node.y + node.h / 2 - Math.sqrt(m),
            width,
            height: 2 * Math.sqrt(m),
        };
 
        return {
            x: innerRect.x + NodeTextPadding,
            y: innerRect.y + NodeTextPadding,
            width: innerRect.width - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        };
    }

}