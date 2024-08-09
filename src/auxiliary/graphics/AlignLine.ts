import {CanvasGraphicNode} from "dahongpao-canvas";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {StraightLine} from "@/interact/utils/AlignResult.ts";


export class AlignLine extends CanvasGraphicNode{

    auxiliaryType:AuxiliaryType=AuxiliaryType.AlignLine;

    pointPairs:StraightLine[];

    lineWidth:number=1;


    constructor(ctx:CanvasRenderingContext2D) {
        super("align-line",ctx);
    }

   update(pointPairs:StraightLine[],lineWidth:number){
        this.pointPairs=pointPairs;
        this.lineWidth=lineWidth;
   }

    drawOnGLCtx(glCtx: CanvasRenderingContext2D) {
        glCtx.save();
        glCtx.strokeStyle = '#647ee5';
        glCtx.lineWidth = this.lineWidth;
        glCtx.globalAlpha = 1;
        glCtx.setLineDash([4,2]);
        for(const pair of this.pointPairs){
            glCtx.beginPath();
            glCtx.moveTo(pair.start.x, pair.start.y);
            glCtx.lineTo(pair.end.x, pair.end.y);
            glCtx.stroke();
        }
        glCtx.restore();
    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }




}