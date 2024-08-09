import {DownAndMoveStreamMode, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {ConnectorLineProcessor} from "@/interact/default/connectLine/ConnectorLineProcessor";
import {ConnectHoverProcessor} from "@/interact/default/connectLine/ConnectHoverProcessor.ts";

export class ConnectLineMode extends DownAndMoveStreamMode {

    constructor() {
        super([
            new ConnectorLineProcessor(),
        ], [new ConnectHoverProcessor()]);
    }

    streamEnable(_event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const detector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
        if (!detector || !detector.detect(ctx.lastDiffTypeEvent, ctx)) {
            return false;
        }
        return true;
    }

}