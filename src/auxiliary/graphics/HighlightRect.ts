import {CanvasGraphicNode} from "dahongpao-canvas";
import {Rect} from "@/text/base/Rect";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {RectPoint} from "dahongpao-core";

export class HighlightRect extends CanvasGraphicNode{


    constructor(ctx:CanvasRenderingContext2D) {
        super("select-rect",ctx);
    }

    selectionList: RectPoint[] = [];
    auxiliaryType:AuxiliaryType=AuxiliaryType.SelectRect;

    updateProps(selectionList: RectPoint[]){
        this.selectionList=selectionList;
    }

    draw() {
        if(this.selectionList.length===0){
            return;
        }
        /** 绘制选中框 */
        const glCtx = this.graphicContext;
        glCtx.save();
        glCtx.strokeStyle = '#647ee5';
        glCtx.lineWidth = 1;
        glCtx.globalAlpha = 1;
        for (const rect of this.selectionList) {
            const {topLeft,topRight,bottomLeft,bottomRight}=rect;
            glCtx.moveTo(topLeft.x,topLeft.y);
            glCtx.lineTo(topRight.x,topRight.y);
            glCtx.lineTo(bottomRight.x,bottomRight.y);
            glCtx.lineTo(bottomLeft.x,bottomLeft.y);
            glCtx.closePath();
            glCtx.stroke();
        }
        glCtx.restore();
    }

}