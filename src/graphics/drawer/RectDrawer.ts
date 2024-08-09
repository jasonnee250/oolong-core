import {GraphicNode, LineDashType} from "dahongpao-core";
import {AbsDrawer} from "@/graphics/drawer/AbsDrawer.ts";

export class RectDrawer extends AbsDrawer{
    draw(node: GraphicNode, ctx: CanvasRenderingContext2D): void {
        if(node.color!=="none"){
            // node.angle=60;
            ctx.fillStyle = node.color;
            ctx.globalAlpha = node.alpha;
            ctx.fillRect(node.x, node.y, node.w, node.h);
        }
        if(Math.abs(node.borderAlpha)<1e-3){
            return;
        }
        if(node.borderColor!=="none"){
            if(node.lineDashType===LineDashType.Dash1){
                ctx.setLineDash([4,2]);
            }else if(node.lineDashType===LineDashType.Dash2){
                ctx.setLineDash([2,2]);
            }
            ctx.strokeStyle = node.borderColor;
            ctx.lineWidth = node.borderWidth;
            ctx.globalAlpha = node.borderAlpha;
            ctx.strokeRect(node.x, node.y, node.w, node.h);
        }
    }

}