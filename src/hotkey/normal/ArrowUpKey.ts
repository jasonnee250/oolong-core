import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import {MoveCursorTextLog} from "@/action/log/text/MoveCursorTextLog.ts";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {StartLog} from "@/action/log/common/StartLog";
import {EndLog} from "@/action/log/common/EndLog";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongGraphicUtils} from "@/graphics/utils/OolongGraphicUtils.ts";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";

export class ArrowUpKey extends HotKey {
    type: string=KeyCode.ArrowUp;
    work(event: KeyboardEvent, context: OolongEventContext): void {
        event.preventDefault();
        if(context.auxiliaryManager.selectManager.selectNodes.size>0){
            const selectNode=[...context.auxiliaryManager.selectManager.selectNodes][0];
            if(selectNode instanceof OolongNode){
                const dy=event.shiftKey?-10:-1;
                context.actionManager.execAction(new StartLog());
                context.actionManager.execAction(new UpdateNodeLog({id:selectNode.id,x:selectNode.x,y:selectNode.y+dy}));
                const links=context.nodeManager.nodeLinkMap.get(selectNode.id);
                if(links){
                    for(const linkId of links){
                        const updateLog = InteractiveUtils.generateDrivenUpdateLineMsg(linkId,context.nodeManager);
                        if(updateLog){
                            context.actionManager.execAction(updateLog);
                        }
                    }
                }
                context.actionManager.execAction(new EndLog());
            }else if(selectNode instanceof OolongLine){
                const linkLineInfo=context.nodeManager.oolongLinkMap.get(selectNode.id);
                if(linkLineInfo && (linkLineInfo.start || linkLineInfo.end)){
                    return;
                }
                const dy=event.shiftKey?-10:-1;
                const updatePoints=OolongGraphicUtils.clonePoints(selectNode.points);
                for(const p of updatePoints){
                    p.y+=dy;
                }
                context.actionManager.execAction(new UpdateLineLog({id:selectNode.id,points:updatePoints}));
            }
            context.actionManager.renderManager.addAuxiliaryDrawTask();
        }else if(context.auxiliaryManager.selectionManager.selectionList.length>0){

            const selectionManager = context.auxiliaryManager.selectionManager;
            const text=selectionManager.text!;

            const startPos = text.getPositionPtrFromCursorPosition(selectionManager.start!);

            context.execAction(new FocusTextLog(text.id, FocusTextType.Editing,startPos.serializeTo()));
            context.actionManager.execAction(new StartLog());
            const typeWriter=context.inputManager.typeWriter;
            if(!typeWriter){
                context.actionManager.execAction(new EndLog());
                return;
            }
            const pos=typeWriter.moveUp();
            context.execAction(new MoveCursorTextLog(typeWriter.oolongText.id,pos));
            context.actionManager.execAction(new EndLog());
        }
    }
    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}