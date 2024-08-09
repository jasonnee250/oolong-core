import {ClickHandler, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import {OolongNode} from "@/graphics/OolongNode";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";

export class DbClickEditNodeTextHandler extends ClickHandler{
    node:OolongLine|OolongNode|null=null;
    enable(event: InteractiveEvent, eventCtx: OolongEventContext): boolean {
        if(!eventCtx.onPage(event)){
            //不在当前页面
            return false;
        }
        if (event.originEvent.target !== eventCtx.gmlRender.canvas
            && event.originEvent.target !== eventCtx.auxiliaryCtx.gmlRender.canvas) {
            return false;
        }
        const detector=eventCtx.detectors.get(OolongDetectorEnum.Node);
        if(detector && detector.detect(event,eventCtx)){
            const nodeList=detector.result as OolongNode[];
            for(const node of nodeList){
                if(node.type===OolongNodeType.Shape){
                    this.node=nodeList[0];
                    return true;
                }
                if(node.type===OolongNodeType.Line){
                    this.node=nodeList[0];
                    return true;
                }
            }
        }
        return false;
    }
    handle(event: InteractiveEvent, eventCtx: OolongEventContext): void {
        if(!this.node){
            return;
        }
        const editText=eventCtx.inputManager.typeWriter?.oolongText!==undefined;
        if(this.node instanceof OolongNode){
            const oolongText=this.node.oolongText!;
            const start=oolongText.getHeadCursorPosition();
            const hasText=oolongText.hasText()
            if(editText && hasText){

                const editPosition=this.node.oolongText!.detect(event.globalPoint);
                const start=new TextCursorPosition(editPosition.paragraphPtr!.data!.index,0,-1);
                const linePtr=editPosition.paragraphPtr!.data!.tail.prev!.data!;
                const charPtr=linePtr.tail.prev!.data!;
                const end=new TextCursorPosition(editPosition.paragraphPtr!.data!.index,linePtr.index,charPtr.index);
                eventCtx.execAction(new FocusTextLog(this.node.id,FocusTextType.Selection,start,end));
            }else if(hasText){
                const end=oolongText.getTailTextCursorPosition();
                eventCtx.execAction(new FocusTextLog(this.node.id,FocusTextType.Selection,start,end));
            }else{
                eventCtx.execAction(new FocusTextLog(this.node.id,FocusTextType.Editing,start));
            }
        }
        if(this.node instanceof OolongLine){
            const oolongText=this.node.oolongText;
            if(!oolongText){
                this.node.initText();
            }
            const editPosition=this.node.oolongText!.detect(event.globalPoint);
            eventCtx.execAction(new FocusTextLog(this.node.id,FocusTextType.Editing,editPosition.serializeTo()));
        }

    }

}