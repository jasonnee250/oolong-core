import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig.ts";
import {DeleteTextLog} from "@/action/log/text/EditDeleteTextLog.ts";
import {TextListEnum} from "@/text/base/TextListInfo.ts";
import {TextParagraphListLog} from "@/action/log/text/TextParagraphListLog.ts";

export class DeleteKey extends HotKey {
    type: string=KeyCode.Backspace;
    work(_event: KeyboardEvent, context: OolongEventContext): void {
        const typeWriter=context.inputManager.typeWriter;
        if(!typeWriter){
            return;
        }
        const editPos=typeWriter.editPosition;
        if(editPos.linePtr?.data?.index===0 && editPos.charPtr===editPos.linePtr.data.head){
            if(editPos.paragraphPtr!.data!.listInfo.listType!==TextListEnum.None){
                context.execAction(new TextParagraphListLog(typeWriter.oolongText.id,[{pIndex:editPos.paragraphPtr!.data!.index,
                    listInfo:{listType:TextListEnum.None,levelNum:0}}]));
                return;
            }

        }
        if(!typeWriter.duringComposition) {
            context.execAction(new DeleteTextLog())
        }

    }
    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}