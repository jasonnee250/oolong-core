import {DownAndMoveStreamMode, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {DragSelectTextProcessor} from "@/interact/default/dragSelectText/DragSelectTextProcessor";

export class DragSelectTextMode extends DownAndMoveStreamMode{

    constructor() {
        super([
            new DragSelectTextProcessor(),
        ]);
    }
    streamEnable(_event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const isEditText=ctx.inputManager.typeWriter!==null;
        const isSelection=ctx.auxiliaryManager.selectionManager.selectionList.length>0;
        if(isEditText || isSelection){
            return true;
        }
        return false;
    }

}