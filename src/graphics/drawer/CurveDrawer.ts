import {IDrawer} from "@/graphics/IDrawer";
import {OolongLine} from "@/graphics/OolongLine";
import {Rect} from "@/text/base/Rect.ts";
import {GraphicNode, LineDashType} from "dahongpao-core";

export class CurveDrawer implements IDrawer {
    draw(node: OolongLine, ctx: CanvasRenderingContext2D): void {
        if (node.points.length < 3) {
            return;
        }
        let start = node.points[0];
        ctx.strokeStyle = node.color;
        ctx.globalAlpha = node.alpha;
        ctx.lineWidth = node.width;
        ctx.save();
        ctx.beginPath();
        if(node.lineDashType===LineDashType.Dash1){
            ctx.setLineDash([4,2]);
        }else if(node.lineDashType===LineDashType.Dash2){
            ctx.setLineDash([2,2]);
        }
        for (let i = 1; i < node.points.length - 1; i = i + 2) {
            ctx.moveTo(start.x, start.y);
            const p1 = node.points[i];
            const p2 = node.points[i + 1];
            start = p2;
            ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
        }
        ctx.stroke();
        ctx.restore();
        ctx.beginPath();
        ctx.lineJoin = 'round';
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