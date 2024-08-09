import {IPasteHandler} from "@/copyPaste/paste/IPasteHandler";
import {EditTextLog} from "@/action/log/text/EditDeleteTextLog.ts";
import {WheelUtils} from "@/plugin/WheelUtils.ts";
import {OolongEventContext} from "@/interact/OolongEventContext.ts";

export class PlainTextPasteHandler implements IPasteHandler{
    paste(e: ClipboardEvent,eventCtx: OolongEventContext): boolean {
        const data = e.clipboardData;
        const text = data?.getData("text/plain");
        if (!text) {
            return false;
        }
        const prevGlobalPoint = eventCtx.inputManager.typeWriter!.getCursorPosition();

        const editLog=new EditTextLog(text);
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