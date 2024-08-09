import {CanvasGraphicNode} from "dahongpao-canvas";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {AffineMatrix, Point, RectPoint} from "dahongpao-core";
import {OolongNode} from "@/graphics/OolongNode";

/**
 * 单选 选中框
 */
export class SingleSelectBound extends CanvasGraphicNode{

    auxiliaryType:AuxiliaryType=AuxiliaryType.SingleSelectBound;
    points:Point[]=[];

    transform:AffineMatrix=AffineMatrix.generateMatrix();

    constructor(ctx:CanvasRenderingContext2D) {
        super("single-select-bound",ctx);
    }

    update(x:number,y:number,w:number,h:number,points:Point[],transform:AffineMatrix){
        this.x=x;
        this.y=y;
        this.h=h;
        this.w=w;
        this.points=points;
        this.transform=transform;
    }

    drawOnGLCtx(glCtx: CanvasRenderingContext2D) {
        glCtx.save();
        const {a,b,c,d,e,f}=this.transform;
        glCtx.transform(a,b,c,d,e,f);
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
        glCtx.fillStyle = '#647ee5';
        for (const p of this.points) {
            glCtx.beginPath();
            glCtx.ellipse(p.x, p.y, 5, 5, 0, 0, 2 * Math.PI, false);
            glCtx.closePath();
            glCtx.fill();
        }

    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }

}