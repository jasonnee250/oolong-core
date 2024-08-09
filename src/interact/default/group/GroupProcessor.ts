import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog";
import {Point, RectNode} from "dahongpao-core";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType.ts";
import {SelectGroup} from "@/auxiliary/graphics/SelectGroup.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";

export class GroupProcessor extends StreamProcessor{

    startPoint:Point|null=null;
    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        this.startPoint =event.globalPoint;
        ctx.actionManager.execAction(new StartLog());
        ctx.actionManager.execAction(new SelectNodeLog([]));
        ctx.auxiliaryManager.renderToolMenu();
    }
    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        if(!this.startPoint){
            return;
        }
        const xMin=event.globalPoint.x>this.startPoint.x?this.startPoint.x:event.globalPoint.x;
        const xMax=event.globalPoint.x<this.startPoint.x?this.startPoint.x:event.globalPoint.x;
        const yMin=event.globalPoint.y>this.startPoint.y?this.startPoint.y:event.globalPoint.y;
        const yMax=event.globalPoint.y<this.startPoint.y?this.startPoint.y:event.globalPoint.y;
        const groupRect:RectNode={id:'group-rect',minX:xMin,maxX:xMax,minY:yMin,maxY:yMax};
        const g=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.SelectGroup) as SelectGroup;
        g.update(xMin,yMin,xMax-xMin,yMax-yMin);
        ctx.auxiliaryManager.addRenderType(AuxiliaryType.SelectGroup);

        const graphics=ctx.nodeManager.searchNodes(xMin,yMin,xMax,yMax);
        const selectIds:string[]=[];

        for(const g of graphics){
            if(g instanceof OolongNode){
                if(InteractiveUtils.overlapRect(g.getBounds(),groupRect)){
                    selectIds.push(g.id);
                }
            }else if(g instanceof OolongLine){
                if(InteractiveUtils.overlapOolongLine(g,groupRect)){
                    selectIds.push(g.id);
                }
            }
        }
        ctx.actionManager.execAction(new SelectNodeLog(selectIds));

    }
    onUp(_event: InteractiveEvent, ctx: OolongEventContext): void {
        ctx.actionManager.execAction(new EndLog([]));
        ctx.auxiliaryManager.renderToolMenu();
        this.startPoint =null;
    }

}