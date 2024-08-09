import {CanvasGraphicNode} from "dahongpao-canvas";
import {Rect} from "@/text/base/Rect";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";

export class TextSelection extends CanvasGraphicNode{

    constructor(ctx:CanvasRenderingContext2D) {
        super("text-selection",ctx);
    }

    selectionList: Rect[] = [];
    auxiliaryType:AuxiliaryType=AuxiliaryType.TextSelection;

    updateProps(selectionList: Rect[]){
        this.selectionList=selectionList;
    }

    draw() {
        if(this.selectionList.length===0){
            return;
        }
        /** 绘制选中框 */
        const glCtx = this.graphicContext;
        glCtx.save();
        glCtx.fillStyle = '#153fea';
        glCtx.globalAlpha = 0.5;
        for (const rect of this.selectionList) {
            glCtx.fillRect(rect.x, rect.y,
                rect.width, rect.height);
        }
        glCtx.restore();
    }
}