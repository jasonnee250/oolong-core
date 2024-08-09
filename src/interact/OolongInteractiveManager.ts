import {CanvasRender, EventContext, InteractiveEvent, InteractiveEventType, InteractiveManager} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext.ts";
import { Point } from "dahongpao-core";
import { OolongRender } from "@/app/OolongRender";

export class OolongInteractiveManager extends InteractiveManager{


    afterOnEvent(event:InteractiveEvent,ctx:OolongEventContext):void{
        super.afterOnEvent(event,ctx);
        // ctx.auxiliaryManager.draw();
    }

    onEvent(event:PointerEvent,ctx:OolongEventContext):void{

        //reset
        super.reset(event,ctx);
        const interactiveEvent=super.convertInteractiveEvent(event,ctx);
        this.detect(interactiveEvent,ctx);
        this.currentMode.work(interactiveEvent,ctx);
        this.afterOnEvent(interactiveEvent,ctx);
    }

    detect(event:InteractiveEvent,ctx:OolongEventContext):void{
        /** 当前子模式不能退出，仍在当前子模式下执行事件 */
        if(!this.currentMode.canBeExit(event,ctx)){
            return;
        }
        /** 当前子模式能退出，重新寻找能够执行的子模式 */
        for(const mode of this.modes){
            if(mode.canBeEnable(event,ctx)){
                this.currentMode=mode;
                return;
            }
        }
    }
}