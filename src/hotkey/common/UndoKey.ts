import { OolongEventContext } from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";

export class UndoKey extends HotKey {
    type: string=KeyCode.KeyZ;
    work(event: KeyboardEvent, context: OolongEventContext): void {
        context.actionManager.undo();
    }

    enable(event: KeyboardEvent): boolean {
        return event.metaKey;
    }

}