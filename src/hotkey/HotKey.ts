import {OolongEventContext} from "@/interact/OolongEventContext.ts";

export abstract class HotKey {

    abstract type:string;

    abstract work(event:KeyboardEvent,context:OolongEventContext):void;

    abstract enable(event:KeyboardEvent):boolean;
}