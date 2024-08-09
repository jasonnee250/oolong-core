import {DownAndMoveStreamMode, InteractiveEvent, StreamMode} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {DragLinePointProcessor} from "@/interact/default/dragLinePoint/DragLinePointProcessor";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";

export class DragLinePointMode extends DownAndMoveStreamMode{

    constructor() {
        super([
            new DragLinePointProcessor(),
        ]);
    }
    streamEnable(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const detector=ctx.detectors.get(OolongDetectorEnum.PolyControlPoint);
        if(!detector||!detector.detect(ctx.lastDiffTypeEvent!,ctx)){
            return false;
        }
        return true;
    }

}