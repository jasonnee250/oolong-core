import {Point, RectPoint} from "dahongpao-core";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {CanvasGraphicNode} from "dahongpao-canvas";

export class HoverBound extends CanvasGraphicNode{

    points:Point[]=[];
    rectPoint:RectPoint|null=null;

    auxiliaryType:AuxiliaryType=AuxiliaryType.HoverBounds;

    constructor(ctx:CanvasRenderingContext2D) {
        super("hover-bound",ctx);
    }
    drawOnGLCtx(glCtx: CanvasRenderingContext2D) {
        if(!this.rectPoint){
            return;
        }
        glCtx.save();
        glCtx.strokeStyle = '#647ee5';
        glCtx.lineWidth = 2;
        glCtx.globalAlpha = 1;
        const {topLeft,topRight,bottomLeft,bottomRight}=this.rectPoint;
        glCtx.beginPath();
        glCtx.moveTo(topLeft.x,topLeft.y);
        glCtx.lineTo(topRight.x,topRight.y);
        glCtx.lineTo(bottomRight.x,bottomRight.y);
        glCtx.lineTo(bottomLeft.x,bottomLeft.y);
        glCtx.closePath();
        glCtx.stroke();
        glCtx.fillStyle = '#647ee5';
        for (const p of this.points) {
            glCtx.beginPath();
            glCtx.ellipse(p.x, p.y, 5, 5, 0, 0, 2 * Math.PI, false);
            glCtx.closePath();
            glCtx.fill();
        }
        glCtx.restore();
    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }

    update(rectPoint:RectPoint,points:Point[]){
        this.rectPoint=rectPoint;
        this.points=points;
    }

}