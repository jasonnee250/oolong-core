import {HotKey} from "@/hotkey/HotKey";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig.ts";
import {EditTextLog} from "@/action/log/text/EditDeleteTextLog.ts";

export class EnterHotKey extends HotKey{
    enable(_event: KeyboardEvent): boolean {
        return true;
    }
    type: string=KeyCode.Enter;
    work(_event:KeyboardEvent,context:OolongEventContext): void {
        const typeWriter=context.inputManager.typeWriter;
        if(!typeWriter){
            return;
        }
        context.execAction(new EditTextLog('\n'));
        context.inputManager.renderInput.renderCursorHeight=14;
    }

}