import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import {MoveCursorTextLog} from "@/action/log/text/MoveCursorTextLog.ts";

export class ArrowLeftKey extends HotKey {
    type: string = KeyCode.ArrowLeft;

    work(event: KeyboardEvent, context: OolongEventContext): void {
        const typeWriter = context.inputManager.typeWriter;
        if (!typeWriter) {
            return;
        }
        const pos=typeWriter.moveLeft();
        context.execAction(new MoveCursorTextLog(typeWriter.oolongText.id,pos));
    }

    enable(event: KeyboardEvent): boolean {
        return true;
    }

}