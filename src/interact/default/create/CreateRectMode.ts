import {InteractiveEvent} from "dahongpao-canvas";
import {ToolEnum} from "@/tool/ToolEnum";
import {StreamMode} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {RectCreateDragProcessor} from "@/interact/default/create/RectCreateDragProcessor";

export class CreateRectMode extends StreamMode{

    constructor() {
        super([
            new RectCreateDragProcessor()
        ]);
    }
    streamEnable(_event: InteractiveEvent, ctx: OolongEventContext): boolean {
        return ctx.toolManager.currentTool == ToolEnum.SHAPE;
    }

}