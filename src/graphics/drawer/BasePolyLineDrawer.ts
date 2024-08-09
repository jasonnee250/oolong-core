import {IDrawer} from "@/graphics/IDrawer";
import {GraphicNode, LineDashType, Point} from "dahongpao-core";
import {Rect} from "@/text/base/Rect.ts";


export abstract class BasePolyLineDrawer implements IDrawer {
    path:Point[];
    constructor(path:Point[]) {
        this.path=path;
    }
    draw(node: GraphicNode, ctx: CanvasRenderingContext2D): void {
        if (node.color === "none" && node.borderColor === "none") {
            return;
        }
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.alpha;
        ctx.strokeStyle = node.borderColor;
        ctx.lineWidth = node.borderWidth;
        ctx.globalAlpha = node.borderAlpha;
        ctx.beginPath();

        ctx.moveTo(node.x+node.w*this.path[0].x, node.y+node.h*this.path[0].y);
        for(let i=1;i<this.path.length;i++){
            const p=this.path[i];
            ctx.lineTo(node.x+node.w*p.x, node.y+node.h*p.y);
        }
        ctx.closePath();

        if(node.color!=="none"){
            ctx.fill();
        }
        if(node.borderColor!=="none"){
            ctx.save();
            if(node.lineDashType===LineDashType.Dash1){
                ctx.setLineDash([4,2]);
            }else if(node.lineDashType===LineDashType.Dash2){
                ctx.setLineDash([2,2]);
            }
            ctx.stroke();
            ctx.restore();
        }
    }

    abstract textContentBounds(node:GraphicNode): Rect;

}