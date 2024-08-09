import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongGraphicUtils} from "@/graphics/utils/OolongGraphicUtils.ts";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";

export class ArrowRightKey extends HotKey {
    type: string=KeyCode.ArrowRight;
    work(event: KeyboardEvent, context: OolongEventContext): void {
        event.preventDefault();
        if(context.auxiliaryManager.selectManager.selectNodes.size>0){
            const selectNode=[...context.auxiliaryManager.selectManager.selectNodes][0];
            if(selectNode instanceof OolongNode){
                const dx=event.shiftKey?10:1;
                context.actionManager.execAction(new StartLog());
                context.actionManager.execAction(new UpdateNodeLog({id:selectNode.id,y:selectNode.y,x:selectNode.x+dx}));
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
                const dx=event.shiftKey?10:1;
                const updatePoints=OolongGraphicUtils.clonePoints(selectNode.points);
                for(const p of updatePoints){
                    p.x+=dx;
                }
                context.actionManager.execAction(new UpdateLineLog({id:selectNode.id,points:updatePoints}));
            }
            context.actionManager.renderManager.addAuxiliaryDrawTask();
        }else if(context.auxiliaryManager.selectionManager.selectionList.length>0){

            const selectionManager = context.auxiliaryManager.selectionManager;
            const text=selectionManager.text!;

            const endPos = text.getPositionPtrFromCursorPosition(selectionManager.end!);

            context.execAction(new FocusTextLog(text.id, FocusTextType.Editing,endPos.serializeTo()));
        }
    }
    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}