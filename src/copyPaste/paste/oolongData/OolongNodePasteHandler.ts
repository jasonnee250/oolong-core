import {PasteData, PasteType} from "@/copyPaste/base/PasteData";
import { OolongEventContext } from "@/interact/OolongEventContext";
import {IOolongDataHandler} from "@/copyPaste/paste/oolongData/IOolongDataHandler";
import {AddNodeLog} from "@/action/log/node/AddNodeLog";
import {IdGenerator} from "@/utils/IdGenerator";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {InteractiveUtils} from "dahongpao-canvas";

export class OolongNodePasteHandler implements IOolongDataHandler {
    handle(pasteData: PasteData, ctx: OolongEventContext): boolean {
        if(pasteData.pasteType!==PasteType.Nodes){
            return false;
        }
        if(!pasteData.nodes||pasteData.nodes.length===0){
            return false;
        }
        const data=pasteData.nodes;
        const lastPoint=ctx.lastInteractiveEvent?.globalPoint;
        /** 修正id和zIndex */
        for(const nodeDO of data){
            if(lastPoint){
                nodeDO.x=lastPoint.x;
                nodeDO.y=lastPoint.y;
            }
            nodeDO.id=IdGenerator.genId(nodeDO.type as OolongNodeType);
            nodeDO.zIndex = IdGenerator.genZIndex();
            if(nodeDO.type===OolongNodeType.Shape){
                if(nodeDO.oolongText){
                    nodeDO.oolongText.id=nodeDO.id+"-text";
                }
            }

            const addLog=new AddNodeLog(nodeDO);
            ctx.execAction(addLog);
            const node=ctx.nodeManager.nodeMap.get(nodeDO.id) as OolongNode;
            if(node.oolongText){
                const cachePos=node.computeTextPos()!;
                node.oolongText.updatePos(cachePos);
                const cursorPosition=new TextCursorPosition(0,0,-1);
                const positionPtr=node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                node.oolongText.reTypesetting(ctx.pageManager,positionPtr,node);
                const bounds=ctx.gmlRender.getViewPortBounds();
                const graphics = InteractiveUtils.needDrawByMoving(ctx, bounds, new Set<string>(), node);
                ctx.gmlRender.dirtyDraw(bounds, graphics);
            }
        }
        return true;
    }

}