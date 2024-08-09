import SimpleLine from '@/resource/shapes/line/simpleLine.svg?react';
import LineArrow from '@/resource/shapes/line/lineArrow.svg?react';
import PolyArrow from '@/resource/shapes/line/polyArrow.svg?react';
import CurveArrow from '@/resource/shapes/line/curveArrow.svg?react';
import {OolongLineType} from "@/graphics/OolongLineType.ts";

export interface ILineShapeIcon{
    icon:any;
    shape:OolongLineType;
}

export const changeLineConfig: ILineShapeIcon[] = [
    { icon: <SimpleLine /> ,shape:OolongLineType.Line},
    { icon: <PolyArrow /> ,shape:OolongLineType.PolyLine},
    { icon: <CurveArrow />,shape:OolongLineType.Curve},
]
export const lineConfig: ILineShapeIcon[] = [
    { icon: <LineArrow /> ,shape:OolongLineType.LineArrow},
    { icon: <SimpleLine /> ,shape:OolongLineType.Line},
    { icon: <PolyArrow /> ,shape:OolongLineType.PolyLine},
    { icon: <CurveArrow />,shape:OolongLineType.Curve},
]