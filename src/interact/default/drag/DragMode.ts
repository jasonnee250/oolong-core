import {DownAndMoveStreamMode} from "dahongpao-canvas";
import {InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {DragProcessor} from "@/interact/default/drag/DragProcessor";
import {GraphicUtils} from "dahongpao-core";
import {OolongLine} from "@/graphics/OolongLine.ts";

export class DragMode extends DownAndMoveStreamMode{

    constructor() {
        super([
            new DragProcessor()
        ]);
    }
    streamEnable(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const selectManager=ctx.auxiliaryManager.selectManager;
        if(selectManager.selectNodes.size===0){
            return false;
        }
        if(!event.originEvent.altKey){
            const selectNode=[...selectManager.selectNodes][0];
            if(selectNode instanceof OolongLine){
                const linkLineInfo=ctx.nodeManager.oolongLinkMap.get(selectNode.id);
                if(linkLineInfo && (linkLineInfo.start || linkLineInfo.end)){
                    return false;
                }
            }
        }
        const selectBounds=ctx.auxiliaryManager.selectManager.getSelectBounds();
        const res=GraphicUtils.rectContains2(ctx.lastDiffTypeEvent!.globalPoint,selectBounds);
        if(res){
            return true;
        }
        return false;
    }

}