import {HotKey} from "@/hotkey/HotKey";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig.ts";

export class EscHotKey extends HotKey{
    enable(_event: KeyboardEvent): boolean {
        return true;
    }
    type: string=KeyCode.Escape;
    work(_event:KeyboardEvent,context:OolongEventContext): void {
        context.toolManager.resetTool();
        context.setCursor("default");
    }

}