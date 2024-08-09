import {DownAndMoveStreamMode, InteractiveEvent} from "dahongpao-canvas";
import {ToolEnum} from "@/tool/ToolEnum";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {TextCreateDragProcessor} from "@/interact/default/create/TextCreateDragProcessor";

export class CreateTextMode extends DownAndMoveStreamMode{

    constructor() {
        super([
            new TextCreateDragProcessor()
        ]);
    }
    streamEnable(_event: InteractiveEvent, ctx: OolongEventContext): boolean {
        return ctx.toolManager.currentTool == ToolEnum.TEXT;
    }

}