import {ClickProcessor, InteractiveEvent, InteractiveEventType} from "dahongpao-canvas";
import {ClickMainTextHandler} from "@/interact/default/click/handler/ClickMainTextHandler";
import {FocusNodeHandler} from "@/interact/default/click/handler/FocusNodeHandler.ts";
import {ClearFocusNodeHandler} from "@/interact/default/click/handler/ClearFocusNodeHandler.ts";
import {OolongEventContext} from "@/interact/OolongEventContext.ts";
import {ClickNodeTextHandler} from "@/interact/default/click/handler/ClickNodeTextHandler.ts";
import {TextToolClickHandler} from "@/interact/default/click/handler/TextToolClickHandler.ts";
import {ClickTextHandler} from "@/interact/default/click/handler/ClickTextHandler.ts";
import {ShiftClickNodeHandler} from "@/interact/default/click/handler/ShiftClickNodeHandler.ts";
import {ShiftUpClickHandler} from "@/interact/default/click/handler/ShiftUpClickHandler.ts";

export class DefaultClickProcessor extends ClickProcessor{

    constructor() {
        super();
        this.registerDownHandler(new TextToolClickHandler());
        this.registerDownHandler(new ShiftClickNodeHandler());
        this.registerDownHandler(new FocusNodeHandler());
        this.registerDownHandler(new ClickNodeTextHandler());
        this.registerUpHandler(new ShiftUpClickHandler());
        this.registerUpHandler(new ClickMainTextHandler());
        this.registerUpHandler(new ClickTextHandler());
        this.registerUpHandler(new ClearFocusNodeHandler());
    }

    hasWorking:boolean=false;


    process(event: InteractiveEvent, eventCtx: OolongEventContext): void {

        this.downProcess(event,eventCtx);
        this.upProcess(event,eventCtx);
    }

    downProcess(event: InteractiveEvent, eventCtx: OolongEventContext): void{
        if(event.type===InteractiveEventType.pointerDown){
            for(const handler of this.downHandlers){
                if(handler.enable(event, eventCtx)){
                    this.hasWorking=true;
                    handler.handle(event, eventCtx);
                    return;
                }
            }
        }
    }

    upProcess(event: InteractiveEvent, eventCtx: OolongEventContext): void{
        if(event.type===InteractiveEventType.pointerup){
            if(this.hasWorking){
                this.hasWorking=false;
                return;
            }
            for(const handler of this.upHandlers){
                if(handler.enable(event, eventCtx)){
                    handler.handle(event, eventCtx);
                    return;
                }
            }
        }
    }

}