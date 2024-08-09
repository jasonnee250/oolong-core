import {ClickHandler, EventContext, InteractiveEvent} from "dahongpao-canvas";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog.ts";

export class ClearFocusNodeHandler extends ClickHandler{
    enable(event: InteractiveEvent, ctx: EventContext): boolean {
        // const detector=ctx.detectors.get(OolongDetectorEnum.Node);
        // if(detector && detector.detect(event,ctx)){
        //     const res=detector.result as GraphicNode[];
        //     for(const node of res){
        //         if(node.type!==OolongNodeType.Text){
        //             return false;
        //         }
        //     }
        // }
        return true;
    }
    handle(_event: InteractiveEvent, ctx: OolongEventContext): void {
        if(ctx.inputManager.typeWriter){
            ctx.actionManager.execAction(new StartLog());
            ctx.actionManager.execAction(new FocusTextLog(undefined,FocusTextType.Blur));
            ctx.actionManager.execAction(new SelectNodeLog([]));
            ctx.actionManager.execAction(new EndLog());
            ctx.auxiliaryManager.renderToolMenu();
            return;
        }
        ctx.actionManager.execAction(new SelectNodeLog([]));
        ctx.auxiliaryManager.renderToolMenu();
    }

}