import {AbsSubMode} from "dahongpao-canvas";
import {EventContext, InteractiveEvent} from "dahongpao-canvas";
import {HoverProcessor} from "@/interact/default/normal/HoverProcessor.ts";
import {CursorProcessor} from "@/interact/default/normal/CursorProcessor.ts";

export class NormalMode extends AbsSubMode {

    constructor() {
        super([
            new HoverProcessor(),
            new CursorProcessor(),
        ]);
    }
    canBeEnable(_event: InteractiveEvent, _ctx: EventContext): boolean {
        return true;
    }

    canBeExit(_event: InteractiveEvent, _ctx: EventContext): boolean {
        return true;
    }

}