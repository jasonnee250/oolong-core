import {CanvasGraphicNode, ClickHandler, EventContext, InteractiveEvent} from "dahongpao-canvas";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import {StartLog} from "@/action/log/common/StartLog";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog";
import {EndLog} from "@/action/log/common/EndLog";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {GraphicUtils, IGraphicElement} from "dahongpao-core";
import {MainTextId} from "@/text/config/OolongTextConstants";


export class ShiftUpClickHandler extends ClickHandler{

    node:CanvasGraphicNode|null=null;
    enable(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        if(!event.originEvent.shiftKey && !event.originEvent.metaKey){
            return false;
        }
        const selectBounds=ctx.auxiliaryManager.selectManager.getSelectBounds();
        if(!GraphicUtils.rectContains2(event.globalPoint,selectBounds)){
            return false;
        }
        const detector=ctx.detectors.get(OolongDetectorEnum.Node);
        if(detector && detector.detect(event,ctx)){
            const nodeList=detector.result as IGraphicElement[];
            for(const node of nodeList){
                if(node.id===MainTextId){
                    continue;
                }
                this.node=node;
            }
            return true;
        }
        return false;
    }
    handle(_event: InteractiveEvent, ctx: OolongEventContext): void {
        const selectNodes=ctx.auxiliaryManager.selectManager.selectNodes;
        const ids=[...selectNodes].map(p=>p.id);
        if(ctx.inputManager.typeWriter!==null){
            ctx.actionManager.execAction(new StartLog());
            ctx.actionManager.execAction(new FocusTextLog(undefined,FocusTextType.Blur));
            if(ctx.auxiliaryManager.selectManager.include(this.node)){
                const cacheIds=ids.filter(p=>p!==this.node!.id);
                const selectLog=new SelectNodeLog([...cacheIds]);
                ctx.actionManager.execAction(selectLog);
            }else{
                const selectLog=new SelectNodeLog([...ids,this.node!.id]);
                ctx.actionManager.execAction(selectLog);
            }
            ctx.actionManager.execAction(new EndLog());
            ctx.auxiliaryManager.renderToolMenu();
            return;
        }
        if(ctx.auxiliaryManager.selectManager.include(this.node)){
            const cacheIds=ids.filter(p=>p!==this.node!.id);
            const selectLog=new SelectNodeLog([...cacheIds]);
            ctx.actionManager.execAction(selectLog);
            ctx.auxiliaryManager.renderToolMenu();
        }else{
            const selectLog=new SelectNodeLog([...ids,this.node!.id]);
            ctx.actionManager.execAction(selectLog);
            ctx.auxiliaryManager.renderToolMenu();
        }
    }

}