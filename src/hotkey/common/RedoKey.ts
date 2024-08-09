import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import {OolongEventContext} from "@/interact/OolongEventContext";

export class RedoKey extends HotKey {
    type: string=KeyCode.KeyZ;
    work(event: KeyboardEvent, context: OolongEventContext): void {
        context.actionManager.redo();
    }

    enable(event: KeyboardEvent): boolean {
        return event.shiftKey && event.metaKey;
    }

}