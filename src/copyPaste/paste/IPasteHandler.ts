import {OolongEventContext} from "@/interact/OolongEventContext.ts";

export interface IPasteHandler{

    paste(e: ClipboardEvent,ctx: OolongEventContext):boolean;
}