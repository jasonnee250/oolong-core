import {DownAndMoveStreamMode, EventContext, InteractiveEvent} from "dahongpao-canvas";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import {StretchProcessor} from "@/interact/default/stretch/StretchProcessor";

export class StretchMode extends DownAndMoveStreamMode{

    constructor() {
        super([
            new StretchProcessor(),
        ]);
    }
    streamEnable(_event: InteractiveEvent, ctx: EventContext): boolean {
        const detector = ctx.detectors.get(OolongDetectorEnum.Stretch);
        if (detector && detector.detect(ctx.lastDiffTypeEvent!, ctx)) {
            return true;
        }
        return false;
    }

}