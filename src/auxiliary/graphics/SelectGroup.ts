import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {CanvasGraphicNode} from "dahongpao-canvas";

export class SelectGroup extends CanvasGraphicNode{

    auxiliaryType:AuxiliaryType=AuxiliaryType.SelectGroup;

    constructor(ctx:CanvasRenderingContext2D) {
        super("select-group",ctx);
    }

    update(x:number,y:number,w:number,h:number){
        this.x=x;
        this.y=y;
        this.h=h;
        this.w=w;
    }

    drawOnGLCtx(glCtx: CanvasRenderingContext2D) {
        glCtx.save();
        glCtx.fillStyle = '#647ee5';
        glCtx.lineWidth = 1;
        glCtx.globalAlpha = 0.5;
        glCtx.fillRect(this.x, this.y,
            this.w, this.h);
        glCtx.restore();
    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }
}