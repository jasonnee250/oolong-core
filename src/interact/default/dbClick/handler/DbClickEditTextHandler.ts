import {ClickHandler, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {MainTextId} from "@/text/config/OolongTextConstants";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {OolongText} from "@/text/base/OolongText";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import {DocMode} from "@/file/DocSettingDO.ts";

export class DbClickEditTextHandler extends ClickHandler{
    enable(event: InteractiveEvent, eventCtx: OolongEventContext): boolean {
        if(eventCtx.docState.mode!==DocMode.Document){
            return false;
        }
        if(!eventCtx.onPage(event)){
            //不在当前页面
            return false;
        }
        if (event.originEvent.target !== eventCtx.gmlRender.canvas
            && event.originEvent.target !== eventCtx.auxiliaryCtx.gmlRender.canvas) {
            return false;
        }
        const detector=eventCtx.detectors.get(OolongDetectorEnum.HoverNode);
        if(detector && detector.detect(event,eventCtx)){
            return false;
        }
        return true;
    }
    handle(event: InteractiveEvent, eventCtx: OolongEventContext): void {
        const oolongText=eventCtx.nodeManager.nodeMap.get(MainTextId) as OolongText;
        const editPosition=oolongText.detect(event.globalPoint);
        eventCtx.execAction(new FocusTextLog(oolongText.id,FocusTextType.Editing,editPosition.serializeTo()));
    }
    
}