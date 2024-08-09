import {OolongEventContext} from "@/interact/OolongEventContext.ts";

export interface ICopyHandler{

    copy(e: ClipboardEvent,ctx: OolongEventContext):boolean;
}