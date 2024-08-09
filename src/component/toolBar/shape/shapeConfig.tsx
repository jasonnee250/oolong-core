import Babianxing from '@/resource/shapes/base/babianxing.svg?react';
import DoubleArrow from '@/resource/shapes/base/doubleArrow.svg?react';
import Ellipse from '@/resource/shapes/base/ellipse.svg?react';
import LeftArrow from '@/resource/shapes/base/leftArrow.svg?react';
import LeftKuohao from '@/resource/shapes/base/leftKuohao.svg?react';
import Lingxing from '@/resource/shapes/base/lingxing.svg?react';
import LiuBianXing from '@/resource/shapes/base/liubianxing.svg?react';
import LiuCheng from '@/resource/shapes/base/liucheng.svg?react';
import LiuCheng2 from '@/resource/shapes/base/liucheng2.svg?react';
import PingXingsiBianXing from '@/resource/shapes/base/pingxingsibianxing.svg?react';
import Qipao from '@/resource/shapes/base/qipao.svg?react';
import Qipao2 from '@/resource/shapes/base/qipao2.svg?react';
import Rect from '@/resource/shapes/base/rect.svg?react';
import RightArrow from '@/resource/shapes/base/rightArrow.svg?react';
import RightKuohao from '@/resource/shapes/base/rightKuohao.svg?react';
import RoundRect from '@/resource/shapes/base/roundRect.svg?react';
import RoundRect2 from '@/resource/shapes/base/roundRect2.svg?react';
import Shizi from '@/resource/shapes/base/shizi.svg?react';
import Tixing from '@/resource/shapes/base/tixing.svg?react';
import Triangle from '@/resource/shapes/base/triangle.svg?react';
import Triangle2 from '@/resource/shapes/base/triangle2.svg?react';
import Wubianxing from '@/resource/shapes/base/wubianxing.svg?react';
import WuJiaoxing from '@/resource/shapes/base/wujiaoxing.svg?react';
import YuanZhu from '@/resource/shapes/base/yuanzhu.svg?react';
import Yunduo from '@/resource/shapes/base/yunduo.svg?react';
import TextIcon from '@/resource/icons/TextIcon.svg?react'
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";

export interface IShapeIcon{
    icon:any;
    shape:OolongShapeType;
}

export const baseConfig:IShapeIcon[]=[
    { icon: <Rect />, shape: OolongShapeType.Rect },
    { icon: <Ellipse />, shape: OolongShapeType.Ellipse },
    { icon: <Babianxing />, shape: OolongShapeType.Babianxing },
    { icon: <DoubleArrow />, shape: OolongShapeType.DoubleArrow },
    { icon: <LeftArrow />, shape: OolongShapeType.LeftArrow },
    { icon: <LeftKuohao />, shape: OolongShapeType.LeftKuohao },
    { icon: <Lingxing />, shape: OolongShapeType.Lingxing },
    { icon: <LiuBianXing />, shape: OolongShapeType.LiuBianXing },
    { icon: <LiuCheng />, shape: OolongShapeType.LiuCheng },
    { icon: <LiuCheng2 />, shape: OolongShapeType.LiuCheng2 },
    { icon: <PingXingsiBianXing />, shape: OolongShapeType.PingXingsiBianXing },
    { icon: <Qipao />, shape: OolongShapeType.Qipao },
    { icon: <Qipao2 />, shape: OolongShapeType.Qipao2 },
    { icon: <RightArrow />, shape: OolongShapeType.RightArrow },
    { icon: <RightKuohao />, shape: OolongShapeType.RightKuohao },
    { icon: <RoundRect />, shape: OolongShapeType.RoundRect },
    { icon: <RoundRect2 />, shape: OolongShapeType.RoundRect2 },
    { icon: <Shizi />, shape: OolongShapeType.Shizi },
    { icon: <Tixing />, shape: OolongShapeType.Tixing },
    { icon: <Triangle />, shape: OolongShapeType.Triangle },
    { icon: <Triangle2 />, shape: OolongShapeType.Triangle2 },
    { icon: <Wubianxing />, shape: OolongShapeType.Wubianxing },
    { icon: <WuJiaoxing />, shape: OolongShapeType.WuJiaoxing },
    { icon: <YuanZhu />, shape: OolongShapeType.YuanZhu },
]
export const shapeConfig: IShapeIcon[] = [
    ...baseConfig,
    { icon: <Yunduo />, shape: OolongShapeType.Yunduo },
];

export const changeShapeConfig: IShapeIcon[] = [
    { icon: <TextIcon />, shape: OolongShapeType.PureText },
    ...shapeConfig,
];