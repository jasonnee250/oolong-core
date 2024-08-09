import {GraphicNode, GraphicUtils, IGraphicElement, RectNode} from "dahongpao-core";
import {AbsDetector, InteractiveEvent, InteractiveUtils} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";


export enum StretchType {
    TOP,
    LEFT,
    BOTTOM,
    RIGHT,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

const StretchHotBuffer = 5;

export interface StretchInfo {
    nodes: IGraphicElement[],
    stretchBounds:RectNode,
    type: StretchType,
}

export class OolongStretchDetector extends AbsDetector<StretchInfo> {
    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const nodeSet = ctx.auxiliaryManager.selectManager.selectNodes;
        if(nodeSet.size===0){
            return false;
        }
        if(nodeSet.size===1){
            return false;
        }
        const nodes:IGraphicElement[]=[];
        const rectBounds:RectNode[]=[];
        for(const node of nodeSet){
            nodes.push(node);
            rectBounds.push(node.getBounds());
        }
        if(nodes.length===0){
            return false;
        }
        if(nodes.length===1 && nodes[0].type===OolongNodeType.Line){
            return false;
        }
        const stretchBounds=GraphicUtils.getBounds(rectBounds,"stretch-node");
        const stretchNode:GraphicNode=new GraphicNode("stretch-node");
        stretchNode.x=stretchBounds.minX;
        stretchNode.y=stretchBounds.minY;
        stretchNode.w=stretchBounds.maxX-stretchBounds.minX;
        stretchNode.h=stretchBounds.maxY-stretchBounds.minY;

        if (InteractiveUtils.overlapPoint(GraphicUtils.topLeft(stretchNode), event.globalPoint)) {
            this.result = {
                nodes,
                stretchBounds,
                type: StretchType.TOP_LEFT,
            }
            return true;
        }
        if (InteractiveUtils.overlapPoint(GraphicUtils.topRight(stretchNode), event.globalPoint)) {
            this.result = {
                nodes,
                stretchBounds,
                type: StretchType.TOP_RIGHT,
            }
            return true;
        }
        if (InteractiveUtils.overlapPoint(GraphicUtils.bottomRight(stretchNode), event.globalPoint)) {
            this.result = {
                nodes,
                stretchBounds,
                type: StretchType.BOTTOM_RIGHT,
            }
            return true;
        }
        if (InteractiveUtils.overlapPoint(GraphicUtils.bottomLeft(stretchNode), event.globalPoint)) {
            this.result = {
                nodes,
                stretchBounds,
                type: StretchType.BOTTOM_LEFT,
            }
            return true;
        }
        const topContain = GraphicUtils.rectContains2(event.globalPoint,
            {minX: stretchNode.x, minY: stretchNode.y - StretchHotBuffer, maxX: stretchNode.x + stretchNode.w, maxY: stretchNode.y + StretchHotBuffer * 2}
        );
        if (topContain) {
            this.result = {
                nodes,
                stretchBounds,
                type: StretchType.TOP,
            }
            return true;
        }

        const rightContain = GraphicUtils.rectContains2(event.globalPoint,
            {
                minX: stretchNode.x + stretchNode.w - StretchHotBuffer,
                minY: stretchNode.y,
                maxX: stretchNode.x + stretchNode.w + StretchHotBuffer,
                maxY: stretchNode.y + stretchNode.w
            }
        );
        if (rightContain) {
            this.result = {
                nodes,
                stretchBounds,
                type: StretchType.RIGHT,
            }
            return true;
        }

        const bottomContain = GraphicUtils.rectContains2(event.globalPoint,
            {
                minX: stretchNode.x,
                minY: stretchNode.y + stretchNode.h - StretchHotBuffer,
                maxX: stretchNode.x + stretchNode.w,
                maxY: stretchNode.y + stretchNode.h + StretchHotBuffer
            }
        );
        if (bottomContain) {
            this.result = {
                nodes,
                stretchBounds,
                type: StretchType.BOTTOM,
            }
            return true;
        }
        const leftContain = GraphicUtils.rectContains2(event.globalPoint,
            {minX: stretchNode.x - StretchHotBuffer, minY: stretchNode.y, maxX: stretchNode.x + StretchHotBuffer, maxY: stretchNode.y + stretchNode.h}
        );
        if (leftContain) {
            this.result = {
                nodes,
                stretchBounds,
                type: StretchType.LEFT,
            }
            return true;
        }

        this.result = null;
        return false;
    }

}