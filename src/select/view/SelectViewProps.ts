import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {LineDashType, TextAlignType} from "dahongpao-core";
import {TextListEnum} from "@/text/base/TextListInfo.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";

export const MIXED_PROP="mixed";
export interface SelectViewProps {

    /** 节点选中显示参数 */
    color?:string;
    borderColor?:string;
    borderWidth?:number|string;
    type?:OolongNodeType;
    shapeType?:OolongShapeType|OolongLineType;

    /** 文字选中显示参数 */
    hasText?:boolean;
    bold?:boolean;
    italic?:boolean;
    strikeThrough?:boolean,
    underline?:boolean,
    fontColor?:string;
    fontBackgroundColor?:string;
    fontSize?:number;
    horizonAlign?:TextAlignType;
    verticalAlign?:TextAlignType;
    textListEnum?:TextListEnum;
    lineDashType?:LineDashType;
}