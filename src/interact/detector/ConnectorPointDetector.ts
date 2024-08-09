import {AbsDetector, InteractiveEvent} from "dahongpao-canvas";
import {GraphicUtils, IGraphicElement} from "dahongpao-core";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongNode} from "@/graphics/OolongNode";
import {ConnectorPoint} from "@/graphics/ConnectorPoint";

export interface ConnectPointRes{
    connectorPoint:ConnectorPoint;
    node:OolongNode;
}
export class ConnectorPointDetector extends AbsDetector<ConnectPointRes>{
    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const globalPoint = event.globalPoint;
        let nodeList: IGraphicElement[] = ctx.nodeManager.searchNodes(globalPoint.x, globalPoint.y) as IGraphicElement[];
        nodeList=nodeList.sort((a,b)=>{return b.zIndex-a.zIndex});
        for(const node of nodeList){
            if(node instanceof OolongNode){
                const points:ConnectorPoint[]=node.getConnectPoint();
                for (let i=0;i< points.length;i++) {
                    const p=points[i];
                    const res=GraphicUtils.circleContains(event.globalPoint,p,8);
                    if(res){
                        const cache=node.getPos(p.xPos,p.yPos);
                        p.x=cache.x;
                        p.y=cache.y;
                        this.result={
                            node:node,
                            connectorPoint:p,
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }


}