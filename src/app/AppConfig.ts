import {IConfig,} from "dahongpao-canvas";
import {DefaultMode} from "@/interact/default/DefaultMode.ts";
import {HoverNodeDetector} from "@/interact/detector/HoverNodeDetector.ts";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {OolongNodeDetector} from "@/interact/detector/OolongNodeDetector.ts";
import {OolongStretchDetector} from "@/interact/detector/OolongStretchDetector.ts";
import {ParagraphHeadDetector} from "@/interact/detector/ParagraphHeadDetector.ts";
import {PolyLineControlPointDetector} from "@/interact/detector/PolyLineControlPointDetector.ts";
import {CurveControlPointDetector} from "@/interact/detector/CurveControlPointDetector.ts";
import {LineEndPointDetector} from "@/interact/detector/LineEndPointDetector.ts";
import {ConnectorPointDetector} from "@/interact/detector/ConnectorPointDetector.ts";
import {OolongRotateDetector} from "@/interact/detector/OolongRotateDetector.ts";
import {OolongSingleStretchDetector} from "@/interact/detector/OolongSingleStretchDetector.ts";

export class AppConfig implements IConfig {
    detectors = new Map<OolongDetectorEnum,any>([
        [OolongDetectorEnum.Node, new OolongNodeDetector()],
        [OolongDetectorEnum.Stretch,new OolongStretchDetector()],
        [OolongDetectorEnum.HoverNode,new HoverNodeDetector()],
        [OolongDetectorEnum.ParagraphHead,new ParagraphHeadDetector()],
        [OolongDetectorEnum.PolyControlPoint,new PolyLineControlPointDetector()],
        [OolongDetectorEnum.CurveControlPoint,new CurveControlPointDetector()],
        [OolongDetectorEnum.LineEndPoint,new LineEndPointDetector()],
        [OolongDetectorEnum.ConnectorPoint,new ConnectorPointDetector()],
        [OolongDetectorEnum.Rotate,new OolongRotateDetector()],
        [OolongDetectorEnum.SingleStretch,new OolongSingleStretchDetector()],
    ]);

    modes=[
        new DefaultMode(),
    ]

}