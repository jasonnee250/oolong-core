import {DownAndMoveStreamMode, EventContext, InteractiveEvent} from "dahongpao-canvas";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import {SingleStretchProcessor} from "@/interact/default/stretch/SingleStretchProcessor";

export class SingleStretchMode extends DownAndMoveStreamMode{

    constructor() {
        super([
            new SingleStretchProcessor(),
        ]);
    }
    streamEnable(_event: InteractiveEvent, ctx: EventContext): boolean {
        const detector = ctx.detectors.get(OolongDetectorEnum.SingleStretch);
        if (detector && detector.detect(ctx.lastDiffTypeEvent!, ctx)) {
            return true;
        }
        return false;
    }
}