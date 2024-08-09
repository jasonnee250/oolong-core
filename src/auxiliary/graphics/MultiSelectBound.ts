import {Point} from "dahongpao-core";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {CanvasGraphicNode} from "dahongpao-canvas";

export class MultiSelectBound extends CanvasGraphicNode{

    auxiliaryType:AuxiliaryType=AuxiliaryType.MultiSelectBound;

    constructor(ctx:CanvasRenderingContext2D) {
        super("multi-select",ctx);
    }

    update(x:number,y:number,w:number,h:number){
        this.x=x;
        this.y=y;
        this.h=h;
        this.w=w;
    }

    drawOnGLCtx(glCtx: CanvasRenderingContext2D) {
        glCtx.save();
        glCtx.strokeStyle = '#153fea';
        glCtx.lineWidth = 1;
        glCtx.globalAlpha = 1;
        glCtx.strokeRect(this.x, this.y,
            this.w, this.h);
        glCtx.fillStyle = '#ffffff';
        const buffer = 2.5;
        const points: Point[] = [
            new Point(this.x, this.y),
            new Point(this.x + this.w, this.y),
            new Point(this.x, this.y + this.h),
            new Point(this.x + this.w, this.y + this.h),
        ]
        for (const p of points) {
            glCtx.fillRect(p.x - buffer, p.y - buffer, 2 * buffer, 2 * buffer);
            glCtx.strokeRect(p.x - buffer, p.y - buffer, 2 * buffer, 2 * buffer);
        }
        glCtx.restore();
    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }
}