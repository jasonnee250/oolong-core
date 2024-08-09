import {LineArrowType, LineDashType, Point} from "dahongpao-core";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";

export interface OolongLineDO{
    id:string;
    type:string;
    color:string;
    alpha:number;
    width:number;
    fontColor:string;
    fontSize:number;
    lArrow:LineArrowType;
    rArrow:LineArrowType;
    zIndex:number;

    shapeType:OolongLineType;
    points?:Point[];
    lineDashType:LineDashType;

    oolongText?:OolongNodeDO;
    bold?:boolean;
    italic?:boolean;
}

export function generateDefaultLineDO(id:string):OolongLineDO{
    return {
        id,
        shapeType:OolongLineType.Line,
        color:"#BBBFC4",
        alpha:1,
        width:2,
        rArrow:LineArrowType.Arrow,
        lArrow:LineArrowType.None,
        fontSize:14,
        fontColor:"#BBBFC4",
        zIndex:0,
        type:OolongNodeType.Line,
        lineDashType:LineDashType.None,
    }
}