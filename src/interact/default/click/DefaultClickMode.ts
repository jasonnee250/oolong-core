import {EventContext, InteractiveEvent} from "dahongpao-canvas";
import {ClickMode} from "dahongpao-canvas";
import {DefaultClickProcessor} from "@/interact/default/click/DefaultClickProcessor";

export class DefaultClickMode extends ClickMode {

    constructor() {
        super([
            new DefaultClickProcessor()
        ]);
    }
    clickEnable(_event: InteractiveEvent, _ctx: EventContext): boolean {
        return true;
    }

}