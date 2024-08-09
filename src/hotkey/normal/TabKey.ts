import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import {DeleteTextLog, EditTextLog} from "@/action/log/text/EditDeleteTextLog";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {StartLog} from "@/action/log/common/StartLog";
import {EndLog} from "@/action/log/common/EndLog";

export class TabKey extends HotKey {
    type: string=KeyCode.ArrowDown;
    work(event: KeyboardEvent, context: OolongEventContext): void {

        if(context.auxiliaryManager.selectionManager.selectionList.length>0){
            event.preventDefault();
            const selectionManager = context.auxiliaryManager.selectionManager;
            const text=selectionManager.text!;

            const startPos = text.getPositionPtrFromCursorPosition(selectionManager.start!);
            const endPos = text.getPositionPtrFromCursorPosition(selectionManager.end!);

            let deleteNum = 0;
            text!.traversal(startPos, endPos, () => {
                deleteNum++;
                return false;
            });
            // context.execAction(new FocusTextLog(text.id, startPos.serializeTo()));

            context.execAction(new FocusTextLog(text.id,FocusTextType.Editing, endPos.serializeTo()));
            context.actionManager.execAction(new StartLog());
            context.execAction(new DeleteTextLog(deleteNum));

            const typeWriter=context.inputManager.typeWriter;
            if(!typeWriter){
                return;
            }
            context.execAction(new EditTextLog("    "));
            context.actionManager.execAction(new EndLog());
        }
    }

    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}