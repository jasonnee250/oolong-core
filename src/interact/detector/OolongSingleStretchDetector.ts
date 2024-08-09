import {GraphicNode, GraphicUtils, IGraphicElement, Point, RectNode} from "dahongpao-core";
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

export interface SingleStretchInfo {
    node:OolongNode,
    type: StretchType,
}

export class OolongSingleStretchDetector extends AbsDetector<SingleStretchInfo> {
    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const nodeSet = ctx.auxiliaryManager.selectManager.selectNodes;
        if(nodeSet.size!==1){
            return false;
        }
        const node=[...nodeSet][0];
        if(!(node instanceof OolongNode)){
            return false;
        }
        const localPoint=node.toLocalPoint(event.globalPoint);

        if (InteractiveUtils.overlapPoint(new Point(-0.5*node.w,-0.5*node.h), localPoint)) {
            this.result = {
                node,
                type: StretchType.TOP_LEFT,
            }
            return true;
        }
        if (InteractiveUtils.overlapPoint(new Point(0.5*node.w,-0.5*node.h), localPoint)) {
            this.result = {
                node,
                type: StretchType.TOP_RIGHT,
            }
            return true;
        }
        if (InteractiveUtils.overlapPoint(new Point(0.5*node.w,0.5*node.h), localPoint)) {
            this.result = {
                node,
                type: StretchType.BOTTOM_RIGHT,
            }
            return true;
        }
        if (InteractiveUtils.overlapPoint(new Point(-0.5*node.w,0.5*node.h), localPoint)) {
            this.result = {
                node,
                type: StretchType.BOTTOM_LEFT,
            }
            return true;
        }

        const topContain = Math.abs(localPoint.x)<0.5*node.w && Math.abs(localPoint.y+0.5*node.h)<StretchHotBuffer;
        if (topContain) {
            this.result = {
                node,
                type: StretchType.TOP,
            }
            return true;
        }

        const rightContain = Math.abs(localPoint.y)<0.5*node.h && Math.abs(localPoint.x-0.5*node.w)<StretchHotBuffer;
        if (rightContain) {
            this.result = {
                node,
                type: StretchType.RIGHT,
            }
            return true;
        }

        const bottomContain = Math.abs(localPoint.x)<0.5*node.w && Math.abs(localPoint.y-0.5*node.h)<StretchHotBuffer;
        if (bottomContain) {
            this.result = {
                node,
                type: StretchType.BOTTOM,
            }
            return true;
        }
        const leftContain =  Math.abs(localPoint.y)<0.5*node.h && Math.abs(localPoint.x+0.5*node.w)<StretchHotBuffer;

        if (leftContain) {
            this.result = {
                node,
                type: StretchType.LEFT,
            }
            return true;
        }

        this.result = null;
        return false;
    }

}