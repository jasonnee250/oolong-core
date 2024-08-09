import {CanvasGraphicNode, ClickHandler, EventContext, InteractiveEvent} from "dahongpao-canvas";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import {StartLog} from "@/action/log/common/StartLog";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog";
import {EndLog} from "@/action/log/common/EndLog";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {GraphicUtils} from "dahongpao-core";


export class ShiftClickNodeHandler extends ClickHandler{

    node:CanvasGraphicNode|null=null;
    enable(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        if(!event.originEvent.shiftKey && !event.originEvent.metaKey){
            return false;
        }
        const selectBounds=ctx.auxiliaryManager.selectManager.getSelectBounds();
        if(GraphicUtils.rectContains2(event.globalPoint,selectBounds)){
            return false;
        }
        const detector=ctx.detectors.get(OolongDetectorEnum.HoverNode);
        if(detector && detector.detect(event,ctx)){
            const node=detector.result as CanvasGraphicNode;
            this.node=node;
            return true;
        }
        return false;
    }
    handle(_event: InteractiveEvent, ctx: OolongEventContext): void {
        const ids=[...ctx.auxiliaryManager.selectManager.selectNodes].map(p=>p.id);
        if(ctx.inputManager.typeWriter!==null){
            ctx.actionManager.execAction(new StartLog());
            ctx.actionManager.execAction(new FocusTextLog(undefined,FocusTextType.Blur));
            const selectLog=new SelectNodeLog([...ids,this.node!.id]);
            ctx.actionManager.execAction(selectLog);
            ctx.actionManager.execAction(new EndLog());
            ctx.auxiliaryManager.renderToolMenu();
            return;
        }
        const selectLog=new SelectNodeLog([...ids,this.node!.id]);
        ctx.actionManager.execAction(selectLog);
        ctx.auxiliaryManager.renderToolMenu();
    }

}