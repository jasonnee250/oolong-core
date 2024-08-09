import {InteractiveEvent} from "dahongpao-canvas";
import {ToolEnum} from "@/tool/ToolEnum";
import {StreamMode} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {LineCreateDragProcessor} from "@/interact/default/create/LineCreateDragProcessor";
import {ConnectHoverProcessor} from "@/interact/default/connectLine/ConnectHoverProcessor.ts";

export class CreateLineMode extends StreamMode{

    constructor() {
        super([
            new LineCreateDragProcessor()
        ],[new ConnectHoverProcessor()]);
    }
    streamEnable(_event: InteractiveEvent, ctx: OolongEventContext): boolean {
        return ctx.toolManager.currentTool == ToolEnum.LINE;
    }

}