import {AbsDetector, InteractiveEvent} from "dahongpao-canvas";
import {IGraphicElement} from "dahongpao-core";
import {OolongEventContext} from "@/interact/OolongEventContext";

export class OolongNodeDetector extends AbsDetector<IGraphicElement[]>{
    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const globalPoint = event.globalPoint;
        const nodeList: IGraphicElement[] = ctx.nodeManager.searchNodes(globalPoint.x, globalPoint.y) as IGraphicElement[];

        let filterList:IGraphicElement[]=[];
        for(const node of nodeList){
            if(node.contains(event.globalPoint)){
                filterList.push(node);
            }
        }
        filterList=filterList.sort((a,b)=>{return b.zIndex-a.zIndex});

        if(filterList.length===0){
            this.result=null;
            return false;
        }
        this.result=filterList;
        return true;
    }

}