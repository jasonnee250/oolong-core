import { OolongEventContext } from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import {EditTextLog} from "@/action/log/text/EditDeleteTextLog";
import {TextListEnum} from "@/text/base/TextListInfo.ts";
import {TextParagraphListLog} from "@/action/log/text/TextParagraphListLog.ts";

export class TabKey extends HotKey {
    type: string=KeyCode.ArrowDown;
    work(event: KeyboardEvent, context: OolongEventContext): void {
        const typeWriter = context.inputManager.typeWriter;
        if (!typeWriter) {
            return;
        }
        event.preventDefault();

        const editPos=typeWriter.editPosition;
        if(editPos.linePtr?.data?.index===0 && editPos.charPtr===editPos.linePtr.data.head){
            const listInfo=editPos.paragraphPtr!.data!.listInfo;
            if(listInfo.listType===TextListEnum.Ordered){
                context.execAction(new TextParagraphListLog(typeWriter.oolongText.id,[{pIndex:editPos.paragraphPtr!.data!.index,
                    listInfo:{listType:TextListEnum.Ordered,levelNum:listInfo.levelNum+1,orderNum:1}}]));
                return;
            }
            if(listInfo.listType===TextListEnum.UnOrdered){
                context.execAction(new TextParagraphListLog(typeWriter.oolongText.id,[{pIndex:editPos.paragraphPtr!.data!.index,
                    listInfo:{listType:TextListEnum.UnOrdered,levelNum:listInfo.levelNum+1,orderNum:listInfo.orderNum}}]));
                return;
            }

        }

        context.execAction(new EditTextLog("    "));
    }

    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}