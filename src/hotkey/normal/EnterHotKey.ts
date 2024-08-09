import {HotKey} from "@/hotkey/HotKey";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig.ts";
import {DeleteTextLog, EditTextLog} from "@/action/log/text/EditDeleteTextLog.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog.ts";

export class EnterHotKey extends HotKey{
    enable(_event: KeyboardEvent): boolean {
        return true;
    }
    type: string=KeyCode.Enter;
    work(_event:KeyboardEvent,context:OolongEventContext): void {
        if(context.auxiliaryManager.selectionManager.selectionList.length>0){

            const selectionManager = context.auxiliaryManager.selectionManager;
            const text=selectionManager.text!;

            const startPos = text.getPositionPtrFromCursorPosition(selectionManager.start!);
            const endPos = text.getPositionPtrFromCursorPosition(selectionManager.end!);

            let deleteNum = 0;
            text!.traversal(startPos, endPos, () => {
                deleteNum++;
                return false;
            });
            context.execAction(new FocusTextLog(text.id, FocusTextType.Editing,endPos.serializeTo()));
            context.actionManager.execAction(new StartLog());
            context.execAction(new DeleteTextLog(deleteNum));

            const typeWriter=context.inputManager.typeWriter;
            if(!typeWriter){
                return;
            }
            context.execAction(new EditTextLog('\n'));
            context.inputManager.renderInput.renderCursorHeight=14;
            context.actionManager.execAction(new EndLog());
        }
    }

}