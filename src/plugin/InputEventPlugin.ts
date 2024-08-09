import {IPlugin} from "dahongpao-core";
import {OolongEventContext} from "@/interact/OolongEventContext.ts";
import {DeleteTextLog, EditTextLog} from "@/action/log/text/EditDeleteTextLog.ts";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

export class InputEventPlugin implements IPlugin {
    eventCtx: OolongEventContext;
    lastCompositeChar: string = "";

    constructor(eventCtx: OolongEventContext) {
        this.eventCtx = eventCtx;
    }

    start(): void {
        const inputDom = this.eventCtx.inputManager.renderInput?.inputDom;
        if (!inputDom) {
            console.error("input dom is not exist");
            return;
        }
        inputDom.addEventListener("input", this.onKeyDown);
        inputDom.addEventListener("compositionstart", this.compositionStart);
        inputDom.addEventListener("compositionend", this.compositionEnd);
    }

    stop(): void {
        const inputDom = this.eventCtx.inputManager.renderInput?.inputDom;
        if (!inputDom) {
            console.error("input dom is not exist");
            return;
        }
        inputDom.removeEventListener("input", this.onKeyDown);
        inputDom.removeEventListener("compositionstart", this.compositionStart);
        inputDom.removeEventListener("compositionend", this.compositionEnd);
    }

    compositionEnd = (event: any) => {
        const typeWriter = this.eventCtx.inputManager.typeWriter;
        if (!typeWriter) {
            return;
        }
        typeWriter.duringComposition = false;
        const inputData = event.data as string;
        this.eventCtx.execAction(new DeleteTextLog(this.lastCompositeChar.length));
        this.eventCtx.execAction(new EditTextLog(inputData));
        this.lastCompositeChar = "";
    }
    compositionStart = (_event: any) => {
        const ctx=this.eventCtx;
        if(ctx.auxiliaryManager.selectionManager.selectionList.length>0){
            const selectionManager = ctx.auxiliaryManager.selectionManager;
            const text=selectionManager.text!;

            const startPos = text.getPositionPtrFromCursorPosition(selectionManager.start!);
            const endPos = text.getPositionPtrFromCursorPosition(selectionManager.end!);

            let deleteNum = 0;
            text!.traversal(startPos, endPos, () => {
                deleteNum++;
                return false;
            });
            ctx.execAction(new FocusTextLog(text.id, FocusTextType.Editing,endPos.serializeTo()));
            ctx.execAction(new DeleteTextLog(deleteNum));
        }
        const typeWriter = this.eventCtx.inputManager.typeWriter;
        if (!typeWriter) {
            return;
        }
        typeWriter.duringComposition = true;
        this.lastCompositeChar = "";
    }

    onTextSelectionKeyDown(event: any){
        const ctx=this.eventCtx;
        if(ctx.auxiliaryManager.selectionManager.selectionList.length>0){

            if (!event.data) {
                return;
            }
            const data: string = event.data;
            if (data === '') {
                return;
            }

            const selectionManager = ctx.auxiliaryManager.selectionManager;
            const text=selectionManager.text!;

            const startPos = text.getPositionPtrFromCursorPosition(selectionManager.start!);
            const endPos = text.getPositionPtrFromCursorPosition(selectionManager.end!);

            let deleteNum = 0;
            text!.traversal(startPos, endPos, () => {
                deleteNum++;
                return false;
            });
            ctx.execAction(new FocusTextLog(text.id, FocusTextType.Editing,endPos.serializeTo()));
            ctx.actionManager.execAction(new StartLog());
            ctx.execAction(new DeleteTextLog(deleteNum));

            const typeWriter = this.eventCtx.inputManager.typeWriter;
            if (!typeWriter) {
                ctx.actionManager.execAction(new EndLog());

                return;
            }

            if (this.lastCompositeChar.length > 0) {
                this.eventCtx.execAction(new DeleteTextLog(this.lastCompositeChar.length))
            }
            this.eventCtx.execAction(new EditTextLog(data));
            ctx.actionManager.execAction(new EndLog());
            if (typeWriter.duringComposition) {
                this.lastCompositeChar = data;
            }
        }
    }

    onKeyDown = (event: any) => {
        if(this.eventCtx.auxiliaryManager.selectionManager.selectionList.length>0){
            this.onTextSelectionKeyDown(event);
            return;
        }
        if (!event.data) {
            return;
        }
        const data: string = event.data;
        if (data === '') {
            return;
        }
        const typeWriter = this.eventCtx.inputManager.typeWriter;
        if (!typeWriter) {
            return;
        }

        if (this.lastCompositeChar.length > 0) {
            this.eventCtx.execAction(new DeleteTextLog(this.lastCompositeChar.length))
        }
        this.eventCtx.execAction(new EditTextLog(data));

        if (typeWriter.duringComposition) {
            this.lastCompositeChar = data;
        }
    }

}