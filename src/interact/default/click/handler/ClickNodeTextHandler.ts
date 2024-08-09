import {ClickHandler, InteractiveEvent} from "dahongpao-canvas";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongNode} from "@/graphics/OolongNode";

export class ClickNodeTextHandler extends ClickHandler{
    enable(event: InteractiveEvent, eventCtx: OolongEventContext): boolean {
        if (!eventCtx.canBeEditText()) {
            return false;
        }
        const inSelect=eventCtx.inSelect(event.globalPoint);
        return inSelect;
    }
    handle(event: InteractiveEvent, ctx: OolongEventContext): void {
        //当前页面
        const textNode=[...ctx.auxiliaryManager.selectManager.selectNodes][0] as OolongNode;
        if(ctx.inputManager.typeWriter){
            ctx.inputManager.blur();
        }
        if(textNode){
            const oolongText=textNode.oolongText!;
            const editPosition=oolongText.detect(event.globalPoint);
            ctx.execAction(new FocusTextLog(textNode.id,FocusTextType.Editing,editPosition.serializeTo()));
            return;
        }
    }

}