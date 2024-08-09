import {HotKey} from "@/hotkey/HotKey";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig.ts";

export class EscHotKey extends HotKey{
    enable(_event: KeyboardEvent): boolean {
        return true;
    }
    type: string=KeyCode.Escape;
    work(_event:KeyboardEvent,context:OolongEventContext): void {
        const typeWriter=context.inputManager.typeWriter;
        if(!typeWriter){
            return;
        }
        const textNode=context.inputManager.typeWriter?.oolongText;
        if(textNode){
            context.nodeManager.addIndexNode(textNode.getRectNode());
        }
        context.inputManager.blur();
        context.toolManager.resetTool();
    }

}