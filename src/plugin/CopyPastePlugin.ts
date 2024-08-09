import {IPlugin} from "dahongpao-core";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {CopyPasteManager} from "@/copyPaste/CopyPasteManager.ts";


export class CopyPastePlugin implements IPlugin{
    eventCtx: OolongEventContext;
    copyPasteManager:CopyPasteManager;

    constructor(eventCtx: OolongEventContext) {
        this.eventCtx = eventCtx;
        this.copyPasteManager=new CopyPasteManager(eventCtx);
    }

    start(): void {
        document.addEventListener("copy", this.onCopy);
        document.addEventListener("paste", this.onPaste);
        document.addEventListener("cut", this.onCut);
    }

    stop(): void {
        document.removeEventListener("copy", this.onCopy);
        document.removeEventListener("paste", this.onPaste);
        document.removeEventListener("cut", this.onCut);
    }

    onCopy=(event:ClipboardEvent)=>{
        this.copyPasteManager.copy(event);
    }
    onPaste=(event:ClipboardEvent)=>{
        this.copyPasteManager.paste(event);
    }
    onCut=(event:ClipboardEvent)=>{
        this.copyPasteManager.cut(event);
    }



}