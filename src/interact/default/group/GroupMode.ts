import {DownAndMoveStreamMode, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {GroupProcessor} from "@/interact/default/group/GroupProcessor.ts";

export class GroupMode extends DownAndMoveStreamMode {

    constructor() {
        super([
            new GroupProcessor(),
        ]);
    }

    streamEnable(_event: InteractiveEvent, _ctx: OolongEventContext): boolean {
        return true;
    }

}