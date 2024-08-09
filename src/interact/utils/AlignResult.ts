import {Point, RectNode} from "dahongpao-core";
import {Rect} from "@/text/base/Rect.ts";

export interface StraightLine{
    start:Point;
    end:Point;
}
export interface AlignResult {
    dx:number;
    dy:number;
    lines:StraightLine[];
}

export interface CacheAlignRes{
    dx:number;
    dy:number;
    line:StraightLine;
}

export interface StretchAlignRes{
    rectNode:RectNode;
    isWidth:boolean;
}

export interface AlignStretchResult{
    resList:StretchAlignRes[];
    stretchRect:Rect;
}