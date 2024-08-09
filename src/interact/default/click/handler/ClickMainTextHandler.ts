import {ClickHandler, InteractiveEvent} from "dahongpao-canvas";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {MainTextId, ParagraphSpacing} from "@/text/config/OolongTextConstants";
import {OolongText} from "@/text/base/OolongText";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {DocMode} from "@/file/DocSettingDO.ts";

export class ClickMainTextHandler extends ClickHandler{
    enable(event: InteractiveEvent, eventCtx: OolongEventContext): boolean {
        if(eventCtx.docState.mode!==DocMode.Document){
            return false;
        }
        if(!eventCtx.onPage(event)){
            //不在当前页面
            if(eventCtx.inputManager.typeWriter){
                eventCtx.execAction(new FocusTextLog(undefined,FocusTextType.Blur));
            }
            return false;
        }
        if (event.originEvent.target !== eventCtx.gmlRender.canvas
            && event.originEvent.target !== eventCtx.auxiliaryCtx.gmlRender.canvas) {
            return false;
        }
        const isTextTool=eventCtx.toolManager.currentTool===ToolEnum.TEXT;
        const isEdit=eventCtx.inputManager.typeWriter!==null;
        const isSelection=eventCtx.auxiliaryManager.selectionManager.selectionList.length>0;
        if(eventCtx.auxiliaryManager.selectManager.selectNodes.size>0){
            eventCtx.execAction(new FocusTextLog(undefined,FocusTextType.Blur));
            return false;
        }
        const flag=isEdit||isSelection||isTextTool;
        if(!flag){
            return false;
        }
        const textNode=eventCtx.nodeManager.nodeMap.get(MainTextId);
        const oolongText=textNode as OolongText;

        const rectNode=oolongText.getRectNode();
        if(event.globalPoint.y>rectNode.maxY+ParagraphSpacing){
            return false;
        }
        return true;
    }
    handle(event: InteractiveEvent, ctx: OolongEventContext): void {
        //当前页面
        if(ctx.inputManager.typeWriter){
            ctx.inputManager.blur();
        }
        const textNode=ctx.nodeManager.nodeMap.get(MainTextId);
        if(textNode){
            const oolongText=textNode as OolongText;

            const editPosition=oolongText.detect(event.globalPoint);
            ctx.execAction(new FocusTextLog(oolongText.id,FocusTextType.Editing,editPosition.serializeTo()));
            return;
        }
    }

}