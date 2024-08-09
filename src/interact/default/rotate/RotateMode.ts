import {DownAndMoveStreamMode, EventContext, InteractiveEvent} from "dahongpao-canvas";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import {RotateProcessor} from "@/interact/default/rotate/RotateProcessor";


export class RotateMode extends DownAndMoveStreamMode{

    constructor() {
        super([
            new RotateProcessor(),
        ]);
    }


    streamEnable(_event: InteractiveEvent, ctx: EventContext): boolean {
        const detector = ctx.detectors.get(OolongDetectorEnum.Rotate);
        if (detector && detector.detect(ctx.lastDiffTypeEvent!, ctx)) {
            return true;
        }
        return false;
    }
}