import {GraphicNode, LineDashType, Point} from "dahongpao-core";
import {IDrawer} from "@/graphics/IDrawer";
import {ISvgPointInfo} from "@/graphics/OolongSVGUtils.ts";
import {Rect} from "@/text/base/Rect.ts";

export abstract class BaseCurvePolyDrawer implements IDrawer {

    path:(Point|ISvgPointInfo)[];
    constructor(path:(Point|ISvgPointInfo)[]) {
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



        ctx.lineTo(node.x+node.w*this.path[0].x, node.y+node.h*this.path[0].y);

        for(let i=1;i<this.path.length;i++){
            const p=this.path[i];
            if(p.end){
                ctx.bezierCurveTo(node.x+node.w*p.control1.x,node.y+node.h*p.control1.y,
                    node.x+node.w*p.control2.x,node.y+node.h*p.control2.y,
                    node.x+node.w*p.end.x,node.y+node.h*p.end.y);
            }else{
                ctx.lineTo(node.x+node.w*p.x, node.y+node.h*p.y);
            }
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