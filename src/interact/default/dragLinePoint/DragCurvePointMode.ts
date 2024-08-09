import {DownAndMoveStreamMode, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {DragCurvePointProcessor} from "@/interact/default/dragLinePoint/DragCurvePointProcessor";

export class DragCurvePointMode extends DownAndMoveStreamMode{

    constructor() {
        super([
            new DragCurvePointProcessor(),
        ]);
    }
    streamEnable(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const detector=ctx.detectors.get(OolongDetectorEnum.CurveControlPoint);
        if(!detector||!detector.detect(ctx.lastDiffTypeEvent!,ctx)){
            return false;
        }
        return true;
    }

}