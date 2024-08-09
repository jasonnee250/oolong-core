import {BaseCurvePolyDrawer} from "@/graphics/drawer/BaseCurvePolyDrawer";
import {Rect} from "@/text/base/Rect";
import {GraphicNode} from "dahongpao-core";
import {yunduoConfig} from "@/graphics/drawer/ShapeConfig";

export class YuduoDrawer extends BaseCurvePolyDrawer{


    constructor() {
        super(yunduoConfig);
    }

    textContentBounds(node:GraphicNode): Rect {
        return {
            x:node.x+0.2*node.w,
            y:node.y+0.2*node.h,
            width:0.6*node.w,
            height:0.6*node.h,
        }
    }
}