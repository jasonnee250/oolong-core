import {CanvasGraphicNode} from "dahongpao-canvas";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {Point} from "dahongpao-core";

export class RotateLine extends CanvasGraphicNode{

    auxiliaryType:AuxiliaryType=AuxiliaryType.RotateLine;
    rotateCenter:Point=new Point(0,0);
    dragPoint:Point=new Point(0,0);
    constructor(ctx:CanvasRenderingContext2D) {
        super("rotate-line",ctx);
    }

    updateProps(rotateCenter:Point,dragPoint:Point){
        this.rotateCenter=rotateCenter;
        this.dragPoint=dragPoint;
    }

    drawOnGLCtx(glCtx: CanvasRenderingContext2D) {
        glCtx.save();
        glCtx.strokeStyle = '#153fea';
        glCtx.lineWidth = 1;
        glCtx.globalAlpha = 1;
        glCtx.moveTo(this.rotateCenter.x,this.rotateCenter.y);
        glCtx.lineTo(this.dragPoint.x,this.dragPoint.y);
        glCtx.stroke();
        glCtx.fillStyle = '#ffffff';
        glCtx.beginPath();
        glCtx.ellipse(this.rotateCenter.x, this.rotateCenter.y, 5, 5, 0, 0, 2 * Math.PI, false);
        glCtx.fill();
        glCtx.stroke();
        glCtx.restore();
    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }
}