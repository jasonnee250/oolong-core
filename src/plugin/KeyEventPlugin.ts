import {IPlugin} from "dahongpao-core";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKeyManager} from "@/hotkey/HotKeyManager";


export class KeyEventPlugin implements IPlugin{
    eventCtx: OolongEventContext;
    hotKeyManager:HotKeyManager;

    constructor(eventCtx: OolongEventContext) {
        this.eventCtx = eventCtx;
        this.hotKeyManager=new HotKeyManager(eventCtx);
    }

    start(): void {
        document.addEventListener("keydown", this.onKeyDown);
    }

    stop(): void {
        document.removeEventListener("keydown", this.onKeyDown);
    }

    onKeyDown=(event:KeyboardEvent)=>{
        this.hotKeyManager.work(event,this.eventCtx);
    }



}