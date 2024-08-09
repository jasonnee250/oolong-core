import {CanvasGraphicNode} from "dahongpao-canvas";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {StretchAlignRes} from "@/interact/utils/AlignResult";

export class AlignStretchLine extends CanvasGraphicNode{

    auxiliaryType:AuxiliaryType=AuxiliaryType.AlignStretchLine;
    stretchAlignList:StretchAlignRes[];
    lineWidth:number=1;

    constructor(ctx:CanvasRenderingContext2D) {
        super("align-stretch-line",ctx);
    }

    update(stretchAlignList:StretchAlignRes[],lineWidth:number){
        this.stretchAlignList=stretchAlignList;
        this.lineWidth=lineWidth;
    }

    drawOnGLCtx(glCtx: CanvasRenderingContext2D) {
        const delta=4;
        const deltaPos=2;
        glCtx.save();
        glCtx.strokeStyle = '#647ee5';
        glCtx.lineWidth = this.lineWidth;
        glCtx.globalAlpha = 1;
        for(const stretchAlign of this.stretchAlignList){
            glCtx.beginPath();
            const rectNode=stretchAlign.rectNode;
            if(stretchAlign.isWidth){
                glCtx.moveTo(rectNode.minX,rectNode.maxY+deltaPos);
                glCtx.lineTo(rectNode.minX,rectNode.maxY+2*delta+deltaPos);
                glCtx.moveTo(rectNode.minX, rectNode.maxY+delta+deltaPos);
                glCtx.lineTo(rectNode.maxX, rectNode.maxY+delta+deltaPos);
                glCtx.moveTo(rectNode.maxX,rectNode.maxY+deltaPos);
                glCtx.lineTo(rectNode.maxX,rectNode.maxY+2*delta+deltaPos);
            }else{
                glCtx.moveTo(rectNode.maxX+deltaPos,rectNode.minY);
                glCtx.lineTo(rectNode.maxX+2*delta+deltaPos,rectNode.minY);
                glCtx.moveTo(rectNode.maxX+delta+deltaPos, rectNode.minY);
                glCtx.lineTo(rectNode.maxX+delta+deltaPos, rectNode.maxY);
                glCtx.moveTo(rectNode.maxX+deltaPos,rectNode.maxY);
                glCtx.lineTo(rectNode.maxX+2*delta+deltaPos,rectNode.maxY);
            }
            glCtx.stroke();
        }
        glCtx.restore();
    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }

}