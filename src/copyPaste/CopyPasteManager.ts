import {OolongEventContext} from "@/interact/OolongEventContext";
import {IPasteHandler} from "@/copyPaste/paste/IPasteHandler.ts";
import {PlainTextPasteHandler} from "@/copyPaste/paste/PlainTextPasteHandler.ts";
import {ICopyHandler} from "@/copyPaste/copy/ICopyHandler.ts";
import {CopyTextHandler} from "@/copyPaste/copy/CopyTextHandler.ts";
import {OolongSvgPasteHandler} from "@/copyPaste/paste/OolongSvgPasteHandler.ts";
import {OolongImgPasteHandler} from "@/copyPaste/paste/OolongImgPasteHandler.ts";
import {CopyNodeHandler} from "@/copyPaste/copy/CopyNodeHandler.ts";
import {OolongDataPasteHandler} from "@/copyPaste/paste/OolongDataPasteHandler.ts";

export class CopyPasteManager {
    eventCtx: OolongEventContext;

    pasteHandlers:IPasteHandler[];
    copyHandlers:ICopyHandler[];

    constructor(ctx: OolongEventContext) {
        this.eventCtx = ctx;
        this.pasteHandlers=[
            new OolongImgPasteHandler(),
            new OolongSvgPasteHandler(),
            new OolongDataPasteHandler(),
            new PlainTextPasteHandler(),
        ];
        this.copyHandlers=[
            new CopyTextHandler(),
            new CopyNodeHandler(),
        ];
    }


    paste(e: ClipboardEvent) {
        for(const handler of this.pasteHandlers){
            if(handler.paste(e,this.eventCtx)){
                return;
            }
        }
    }

    copy(e: ClipboardEvent) {
        for(const handler of this.copyHandlers){
            if(handler.copy(e,this.eventCtx)){
                return;
            }
        }

    }

    cut(e: ClipboardEvent) {

        console.log(e);

    }

}