import {HotKey} from "@/hotkey/HotKey";

export class HotKeyConfig {
    keyMap: Map<string, HotKey[]> = new Map<string, HotKey[]>();

    constructor(keyMap: Map<string, HotKey[]>) {
        this.keyMap=keyMap;
    }

    getKey(event:KeyboardEvent):HotKey|null{
        const keyList=this.keyMap.get(event.key);
        if(!keyList){
            return null;
        }
        for(const key of keyList){
            if(key.enable(event)){
                return key;
            }
        }
        return null;
    }

}
