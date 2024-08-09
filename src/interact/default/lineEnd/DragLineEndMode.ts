import {DownAndMoveStreamMode, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {DragLineEndProcessor} from "@/interact/default/lineEnd/DragLineEndProcessor";
import {ConnectHoverProcessor} from "@/interact/default/connectLine/ConnectHoverProcessor.ts";

export class DragLineEndMode extends DownAndMoveStreamMode{

    constructor() {
        super([
            new DragLineEndProcessor(),
        ],[new ConnectHoverProcessor()]);
    }
    streamEnable(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const detector=ctx.detectors.get(OolongDetectorEnum.LineEndPoint);
        if(!detector||!detector.detect(ctx.lastDiffTypeEvent!,ctx)){
            return false;
        }
        return true;
    }

}