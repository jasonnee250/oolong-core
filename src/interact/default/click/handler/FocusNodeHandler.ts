import {CanvasGraphicNode, ClickHandler, InteractiveEvent} from "dahongpao-canvas";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

export class FocusNodeHandler extends ClickHandler{

    node:CanvasGraphicNode|null=null;
    enable(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const detector=ctx.detectors.get(OolongDetectorEnum.HoverNode);
        if(detector && detector.detect(event,ctx)){
            const node=detector.result as CanvasGraphicNode;
            this.node=node;
            return true;
        }
        return false;
    }
    handle(_event: InteractiveEvent, ctx: OolongEventContext): void {
        if(ctx.inputManager.typeWriter!==null){
            ctx.actionManager.execAction(new StartLog());
            ctx.actionManager.execAction(new FocusTextLog(undefined,FocusTextType.Blur));
            const selectLog=new SelectNodeLog([this.node!.id]);
            ctx.actionManager.execAction(selectLog);
            ctx.actionManager.execAction(new EndLog());
            ctx.auxiliaryManager.renderToolMenu();
            return;
        }
        const selectLog=new SelectNodeLog([this.node!.id]);
        ctx.actionManager.execAction(selectLog);
        ctx.auxiliaryManager.renderToolMenu();
    }

}