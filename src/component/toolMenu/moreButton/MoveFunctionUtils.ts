import {GraphicUtils, IGraphicElement} from "dahongpao-core";
import {OolongNode} from "@/graphics/OolongNode";
import {StartLog} from "@/action/log/common/StartLog";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog";
import {OolongLine} from "@/graphics/OolongLine";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog";
import {EndLog} from "@/action/log/common/EndLog";
import {OolongApp} from "@/app/OolongApp";

export interface ComputeZIndex{
    lower:number,
    upper:number
}
function getOverlapNode(graphics:IGraphicElement[],selectNodes:Set<IGraphicElement>):IGraphicElement|null{
    for(const g of graphics){
        if(!selectNodes.has(g)){
            return g;
        }
    }
    return null;
}

function getForwardPairNode(graphic:IGraphicElement,graphics:IGraphicElement[]):ComputeZIndex{
    const index=graphics.indexOf(graphic);
    if(index>0){
        return {
            lower:graphic.zIndex,
            upper:graphics[index-1].zIndex,
        }
    }else if(index===0){
        return {
            lower:graphic.zIndex,
            upper:graphic.zIndex+1,
        }
    }else{
        return {
            lower:graphic.zIndex,
            upper:graphic.zIndex+1,
        }
    }
}

function getBackPairNode(graphic:IGraphicElement,graphics:IGraphicElement[]):ComputeZIndex{
    const index=graphics.indexOf(graphic);
    if(index<graphics.length-2){
        return {
            lower:graphics[index+1].zIndex,
            upper:graphic.zIndex,
        }
    }else if(index===graphics.length-1){
        return {
            lower:graphic.zIndex-1,
            upper:graphic.zIndex,
        }
    }else{
        return {
            lower:graphic.zIndex-1,
            upper:graphic.zIndex,
        }
    }
}

export function moveLayer(oolongApp:OolongApp,getPairZIndex:(graphic:IGraphicElement,graphics:IGraphicElement[])=>ComputeZIndex){
    const selectNodes=oolongApp.auxiliaryManager.selectManager.selectNodes;
    if(selectNodes.size===0){
        return;
    }
    const selectList=[...selectNodes];
    selectList.sort((b, a) => a.zIndex - b.zIndex);
    const boundList=selectList.map(p=>{
        if(p instanceof OolongNode){
            return p.getBounds();
        }else{
            return p.getRectNode();
        }
    });
    const bounds=GraphicUtils.getBounds(boundList,"rect-layer");
    const graphics=oolongApp.application.nodeManager.searchNodes(bounds.minX,bounds.minY,bounds.maxX,bounds.maxY);
    graphics.sort((b, a) => a.zIndex - b.zIndex);
    let g=getOverlapNode(graphics,selectNodes);
    if(g===null){
        g=selectList[0];
    }
    const children=[...oolongApp.application.nodeManager.nodeMap.values(),...oolongApp.application.nodeManager.lineMap.values()];
    children.sort((b, a) => a.zIndex - b.zIndex);
    const res=getPairZIndex(g,children);
    const dt=(res.upper-res.lower)/(selectList.length+1);
    oolongApp.actionManager.execAction(new StartLog());
    for(let i=0;i<selectList.length;i++){
        const node=selectList[i];
        const zIndex=res.upper-(i+1)*dt;
        if(node instanceof OolongNode){
            oolongApp.actionManager.execAction(new UpdateNodeLog({id:node.id,zIndex}));
        }else if(node instanceof OolongLine){
            oolongApp.actionManager.execAction(new UpdateLineLog({id:node.id,zIndex}));
        }
    }
    oolongApp.actionManager.execAction(new EndLog());
}

export function moveForward(oolongApp:OolongApp){
    moveLayer(oolongApp,getForwardPairNode);
}

export function moveBackward(oolongApp:OolongApp){
    moveLayer(oolongApp,getBackPairNode);
}

export function moveToUpper(oolongApp:OolongApp){
    const selectNodes=oolongApp.auxiliaryManager.selectManager.selectNodes;
    if(selectNodes.size===0){
        return;
    }
    const selectList=[...selectNodes];
    selectList.sort((a, b) => a.zIndex - b.zIndex);

    const children=[...oolongApp.application.nodeManager.nodeMap.values(),...oolongApp.application.nodeManager.lineMap.values()];
    children.sort((b, a) => a.zIndex - b.zIndex);

    const maxZIndex=children[0].zIndex;
    oolongApp.actionManager.execAction(new StartLog());
    for(let i=0;i<selectList.length;i++){
        const node=selectList[i];
        const zIndex=maxZIndex+1+i;
        if(node instanceof OolongNode){
            oolongApp.actionManager.execAction(new UpdateNodeLog({id:node.id,zIndex}));
        }else if(node instanceof OolongLine){
            oolongApp.actionManager.execAction(new UpdateLineLog({id:node.id,zIndex}));
        }
    }
    oolongApp.actionManager.execAction(new EndLog());
}

export function moveToLower(oolongApp:OolongApp){
    const selectNodes=oolongApp.auxiliaryManager.selectManager.selectNodes;
    if(selectNodes.size===0){
        return;
    }
    const selectList=[...selectNodes];
    selectList.sort((b, a) => a.zIndex - b.zIndex);

    const children=[...oolongApp.application.nodeManager.nodeMap.values(),...oolongApp.application.nodeManager.lineMap.values()];
    children.sort((a, b) => a.zIndex - b.zIndex);

    const minZIndex=children[0].zIndex;
    oolongApp.actionManager.execAction(new StartLog());
    for(let i=0;i<selectList.length;i++){
        const node=selectList[i];
        const zIndex=minZIndex-1-i;
        if(node instanceof OolongNode){
            oolongApp.actionManager.execAction(new UpdateNodeLog({id:node.id,zIndex}));
        }else if(node instanceof OolongLine){
            oolongApp.actionManager.execAction(new UpdateLineLog({id:node.id,zIndex}));
        }
    }
    oolongApp.actionManager.execAction(new EndLog());
}