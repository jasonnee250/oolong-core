import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey.ts";
import {HotKeyConfig} from "@/hotkey/config/HotKeyConfig.ts";
import {textKeyMap} from "@/hotkey/config/TextConfig.ts";
import {normalKeyMap} from "@/hotkey/config/NormalConfig.ts";

export class HotKeyManager {

    textConfig:HotKeyConfig;
    normalConfig:HotKeyConfig;

    context:OolongEventContext;

    constructor(context:OolongEventContext) {
        this.context=context;
        this.textConfig=new HotKeyConfig(textKeyMap);
        this.normalConfig=new HotKeyConfig(normalKeyMap);
    }


    work(event:KeyboardEvent,context:OolongEventContext):void{
        const key=this.getHotKey(event);
        if(!key){
            return;
        }
        key.work(event,context);
    }

    getHotKey(event:KeyboardEvent):HotKey|null{
        if(this.context.inputManager.typeWriter){
            return this.textConfig.getKey(event);
        }
        return this.normalConfig.getKey(event);
    }

}