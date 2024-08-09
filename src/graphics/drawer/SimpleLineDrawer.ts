import {IDrawer} from "@/graphics/IDrawer";
import {OolongLine} from "@/graphics/OolongLine";
import {GraphicNode, LineDashType} from "dahongpao-core";
import {Rect} from "@/text/base/Rect.ts";

export class SimpleLineDrawer implements IDrawer {
    draw(node: OolongLine, ctx: CanvasRenderingContext2D): void {
        const points=node.points;
        if(points.length===0){
            console.error("line has no point!");
            return;
        }
        const start=points[0];
        const end=points.length>1?points[points.length-1]:{...start};
        ctx.strokeStyle =  node.color;
        ctx.globalAlpha = node.alpha;
        ctx.lineWidth = node.width;
        ctx.save();
        ctx.beginPath();
        if(node.lineDashType===LineDashType.Dash1){
            ctx.setLineDash([4,2]);
        }else if(node.lineDashType===LineDashType.Dash2){
            ctx.setLineDash([2,2]);
        }
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.restore();
        ctx.beginPath();
        node.drawArrow(ctx);
        ctx.stroke();
    }

    textContentBounds(node:GraphicNode): Rect {
        return {
            x:node.x,
            y:node.y,
            width:node.w,
            height:node.h,
        }
    }
    
}