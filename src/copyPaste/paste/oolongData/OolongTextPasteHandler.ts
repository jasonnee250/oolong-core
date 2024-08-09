import {EditTextLog} from "@/action/log/text/EditDeleteTextLog.ts";
import {WheelUtils} from "@/plugin/WheelUtils.ts";
import {OolongEventContext} from "@/interact/OolongEventContext.ts";
import {IOolongDataHandler} from "@/copyPaste/paste/oolongData/IOolongDataHandler.ts";
import {PasteData, PasteType} from "@/copyPaste/base/PasteData.ts";

export class OolongTextPasteHandler implements IOolongDataHandler{
    handle(pasteData:PasteData,eventCtx: OolongEventContext): boolean {
       if(pasteData.pasteType!==PasteType.TextContent){
           return false;
       }
       if(!pasteData.paragraphs||pasteData.paragraphs.length===0){
           return false;
       }
        const paragraphDOList=pasteData.paragraphs;
        let textRes="";

        for(const paragraph of paragraphDOList){
            for(const line of paragraph.lines){
                for(const char of line.charList){
                    textRes=textRes+char.charText;
                }
            }
            textRes+="\n";
        }
        textRes=textRes.slice(0,textRes.length-1);

        const prevGlobalPoint = eventCtx.inputManager.typeWriter!.getCursorPosition();

        const editLog=new EditTextLog(textRes);
        eventCtx.actionManager.execAction(editLog);

        const canvasRect=eventCtx.gmlRender.getViewPortBounds();
        const globalPoint = eventCtx.inputManager.typeWriter!.getCursorPosition();
        if(globalPoint.y>canvasRect.maxY){
            const deltaY = (globalPoint.y - prevGlobalPoint.y) * window.devicePixelRatio;
            //平移
            WheelUtils.scroll(0, deltaY, eventCtx.gmlRender, eventCtx.nodeManager);
            WheelUtils.scroll(0, deltaY, eventCtx.pageManager.pageApplication.gmlRender, eventCtx.pageManager.pageApplication.nodeManager);
            WheelUtils.scroll(0, deltaY, eventCtx.auxiliaryCtx.gmlRender, eventCtx.auxiliaryCtx.nodeManager);
        }
        return true;
    }

}