import {PasteData} from "@/copyPaste/base/PasteData";
import {OolongEventContext} from "@/interact/OolongEventContext";

export interface IOolongDataHandler {

    handle(pasteData:PasteData,ctx: OolongEventContext):boolean;
}