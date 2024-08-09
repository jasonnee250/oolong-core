import {ClickHandler, InteractiveEvent} from "dahongpao-canvas";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongNode} from "@/graphics/OolongNode";
import {ToolEnum} from "@/tool/ToolEnum";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import {IGraphicElement} from "dahongpao-core";
import {MainTextId} from "@/text/config/OolongTextConstants";

export class TextToolClickHandler extends ClickHandler{

    node:OolongNode|null=null;
    enable(event: InteractiveEvent, eventCtx: OolongEventContext): boolean {
        const isTextTool=eventCtx.toolManager.currentTool===ToolEnum.TEXT;
        if (!isTextTool) {
            return false;
        }
        const detecter=eventCtx.detectors.get(OolongDetectorEnum.Node)!;
        if(!detecter.detect(event,eventCtx)){
            return false;
        }
        const res=detecter.result as IGraphicElement[];
        for(const node of res){
            if(node.id===MainTextId){
                continue;
            }
            if(node instanceof OolongNode){
                this.node=node;
                return true;
            }

        }
        return false;
    }
    handle(event: InteractiveEvent, ctx: OolongEventContext): void {
        //当前页面
        const textNode=this.node;
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