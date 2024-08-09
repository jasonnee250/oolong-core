import { OolongEventContext } from "@/interact/OolongEventContext";
import {IPasteHandler} from "@/copyPaste/paste/IPasteHandler";
import {IOolongDataHandler} from "@/copyPaste/paste/oolongData/IOolongDataHandler";
import {CopyPasteUtils} from "@/copyPaste/utils/CopyPasteUtils";
import {PasteData} from "@/copyPaste/base/PasteData";
import {OolongTextPasteHandler} from "@/copyPaste/paste/oolongData/OolongTextPasteHandler.ts";
import {OolongNodePasteHandler} from "@/copyPaste/paste/oolongData/OolongNodePasteHandler.ts";


export class OolongDataPasteHandler implements IPasteHandler {

    handlers:IOolongDataHandler[]=[
        new OolongTextPasteHandler(),
        new OolongNodePasteHandler(),
    ];
    paste(e: ClipboardEvent, ctx: OolongEventContext): boolean {
        const data = e.clipboardData;
        const textData = data?.getData("text/html");
        if (!textData) {
            return false;
        }
        const res=CopyPasteUtils.decode(textData);
        if(res===null){
            return false;
        }
        const pasteData=JSON.parse(res) as PasteData;

        for(const handler of this.handlers){
            if(handler.handle(pasteData,ctx)){
                return true;
            }
        }
        return false;
    }

}