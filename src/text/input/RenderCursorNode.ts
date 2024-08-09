import {CanvasGraphicNode} from "dahongpao-canvas";

export class RenderCursorNode extends CanvasGraphicNode{

    constructor(glCtx:CanvasRenderingContext2D,h:number) {
        super("input_node",glCtx);
        this.w = 2;
        this.h = h;
        this.color = "#000000";
        this.borderAlpha=0;
        this.alpha=0;
    }
    draw() {
        super.draw();
    }

    clear():void{
        this.graphicContext.clearRect(this.x-1,this.y-1,this.w+2,this.h+2);
    }
}