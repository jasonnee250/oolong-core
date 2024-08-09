import {ConnectorPoint} from "@/graphics/ConnectorPoint.ts";
import {NodeManager} from "dahongpao-canvas";
import {OolongNode} from "@/graphics/OolongNode.ts";

export class OolongLinkInfo{
    id:string;//node id
    connectPoint:ConnectorPoint;

    constructor(id:string,connectPoint:ConnectorPoint) {
        this.id=id;
        this.connectPoint=connectPoint;
    }

    updatePos(nodeManager:NodeManager){
        const node=nodeManager.nodeMap.get(this.id);
        if(!node){
            return;
        }
        const point=(node as OolongNode).getPos(this.connectPoint.xPos,this.connectPoint.yPos);
        this.connectPoint.x=point.x;
        this.connectPoint.y=point.y;
    }
}
export class OolongLinkLine {
    id:string;//线id
    start?:OolongLinkInfo;
    end?:OolongLinkInfo;

    constructor(id:string) {
        this.id=id;
    }

    isStartLink(nodeId:string):boolean{
        return nodeId===this.start?.id;
    }

    isEndLink(nodeId:string):boolean{
        return nodeId===this.end?.id;
    }
}