import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig.ts";
import {DeleteTextLog} from "@/action/log/text/EditDeleteTextLog.ts";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {StartLog} from "@/action/log/common/StartLog";
import {EndLog} from "@/action/log/common/EndLog";
import {RemoveNodeLog} from "@/action/log/node/RemoveNodeLog.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {RemoveLinkLog} from "@/action/log/line/RmoveLinkLog.ts";
import {LinkEndType} from "@/action/log/line/AddLinkLog.ts";

export class DeleteKey extends HotKey {
    type: string=KeyCode.Backspace;
    work(_event: KeyboardEvent, context: OolongEventContext): void {
        if(context.auxiliaryManager.selectionManager.selectionList.length>0){

            const selectionManager = context.auxiliaryManager.selectionManager;
            const text=selectionManager.text!;

            const startPos = text.getPositionPtrFromCursorPosition(selectionManager.start!);
            const endPos = text.getPositionPtrFromCursorPosition(selectionManager.end!);

            context.execAction(new FocusTextLog(text.getNodeId(), FocusTextType.Editing,endPos.serializeTo()));
            context.actionManager.execAction(new StartLog());
            const typeWriter=context.inputManager.typeWriter;
            if(!typeWriter){
                context.actionManager.execAction(new EndLog());
                return;
            }
            let deleteNum = 0;
            text!.traversal(startPos, endPos, () => {
                deleteNum++;
                return false;
            });
            context.execAction(new DeleteTextLog(deleteNum));
            context.actionManager.execAction(new EndLog());
            return;
        }
        const selectManager=context.auxiliaryManager.selectManager;
        if(selectManager.selectNodes.size===0){
            return;
        }
        context.actionManager.execAction(new StartLog());
        for(const node of selectManager.selectNodes){
            const id=node.id;
            //去除连接信息
            if(node instanceof OolongLine){
                const linkLine=context.nodeManager.oolongLinkMap.get(node.id);
                if(linkLine?.start){
                    context.actionManager.execAction(new RemoveLinkLog(linkLine.id,LinkEndType.Start));
                }
                if(linkLine?.end){
                    context.actionManager.execAction(new RemoveLinkLog(linkLine.id,LinkEndType.End));
                }
            }
            context.actionManager.execAction(new RemoveNodeLog(id));
        }
        context.actionManager.execAction(new SelectNodeLog([]));
        context.actionManager.execAction(new EndLog());

    }
    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}