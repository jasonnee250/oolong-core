import {OolongParagraphDO} from "@/file/text/OolongParagraphDO";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {TextAlignType,LineDashType} from "dahongpao-core";
import {DefaultFont} from "@/text/config/OolongTextConstants.ts";

/**
 * 节点数据对象
 */
export interface OolongNodeDO {
    id:string;
    x:number;
    y:number;
    w: number;
    h:number;
    angle:number;
    color: string;
    alpha: number;
    fontSize: number;
    fontColor: string;
    fontFamily:string;
    zIndex: number;
    lineDashType?:LineDashType;
    pageId?:string;

    borderColor?: string;
    borderWidth?: number;
    borderAlpha?: number;

    type:string;
    shapeType?:OolongShapeType;
    paragraphs?:OolongParagraphDO[];
    limitWidth?:number;
    bold?:boolean;
    italic?:boolean;
    horizonAlign?:TextAlignType;
    verticalAlign?:TextAlignType;

    oolongText?:OolongNodeDO;

    svgCode?:string;
    imgSrc?:string;

}

export function generateDefaultNodeDO(id:string,shapeType?:OolongShapeType):OolongNodeDO{
    return {
        id,
        x:0,
        y:0,
        w:100,
        h:100,
        angle:0,
        color:"#fbfbfb",
        alpha:1,
        borderColor:"#000000",
        borderAlpha:1,
        borderWidth:1,
        fontSize:14,
        fontFamily:DefaultFont,
        verticalAlign:TextAlignType.CENTER,
        fontColor:"#000000",
        zIndex:0,
        type:OolongNodeType.Shape,
        shapeType,
    }
}