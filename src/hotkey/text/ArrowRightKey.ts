import { OolongEventContext } from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import {MoveCursorTextLog} from "@/action/log/text/MoveCursorTextLog.ts";

export class ArrowRightKey extends HotKey {
    type: string=KeyCode.ArrowRight;
    work(_event: KeyboardEvent, context: OolongEventContext): void {
        const typeWriter=context.inputManager.typeWriter;
        if(!typeWriter){
            return;
        }
        const pos=typeWriter.moveRight();
        context.execAction(new MoveCursorTextLog(typeWriter.oolongText.id,pos));
    }
    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}