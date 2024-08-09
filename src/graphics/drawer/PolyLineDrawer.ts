import {IDrawer} from "@/graphics/IDrawer";
import {OolongLine} from "@/graphics/OolongLine";
import {GraphicNode, LineDashType, Point} from "dahongpao-core";
import {Rect} from "@/text/base/Rect.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";

interface ArcDraw{
    a:Point;
    b:Point;
    r:number;
}
interface LineArcUnit{
    p0:Point;
    p1:Point;
    arcDraw:ArcDraw;

}
export class PolyLineDrawer implements IDrawer {

    radius=8;
    draw(node: OolongLine, ctx: CanvasRenderingContext2D): void {
        if (node.points.length < 2) {
            return;
        }
        const delta=8;

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
        if(node.points.length===2){
            ctx.moveTo(node.points[0].x,node.points[0].y);
            ctx.lineTo(node.points[1].x,node.points[1].y);
            ctx.stroke();
        }else{
            this.acrPolyDraw(ctx,node);
        }
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

    straightPolyDraw(ctx:CanvasRenderingContext2D,node:OolongLine){
        const start = node.points[0];
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < node.points.length; i++) {
            const p = node.points[i];
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();

    }

    acrPolyDraw(ctx:CanvasRenderingContext2D,node:OolongLine){
        const end=node.points[node.points.length-1];
        const resList=this.dealArcPoly(node);
        for(const res of resList){
            ctx.moveTo(res.p0.x,res.p0.y);
            ctx.lineTo(res.p1.x,res.p1.y);
            ctx.arcTo(res.arcDraw.a.x,res.arcDraw.a.y,res.arcDraw.b.x,res.arcDraw.b.y,res.arcDraw.r);
        }
        ctx.lineTo(end.x,end.y);
        ctx.stroke();
    }

    dealArcPoly(node:OolongLine):LineArcUnit[]{

        const points=node.points;
        const res:LineArcUnit[]=[];
        let prev=points[0];
        for(let i=0;i<points.length-2;i=i+1){
            const a=prev;
            const b=points[i+1];
            const c=points[i+2];
            const isHorizon=InteractiveUtils.judgeHorizon(a,b);
            if(isHorizon){
                const r1=0.5*Math.abs(a.x-b.x);
                const r2=0.5*Math.abs(b.y-c.y);
                const rMin=r1>r2?r2:r1;
                const r=this.radius<rMin?this.radius:rMin;
                const delta=r;
                const param1=b.x>a.x?1:-1;
                const param2=c.y>b.y?1:-1;
                prev=new Point(b.x,b.y+param2*delta);
                const lineArcUnit:LineArcUnit={
                    p0:a,
                    p1:new Point(b.x-param1*delta,b.y),
                    arcDraw:{
                        a:b,
                        b:prev,
                        r,
                    }
                }
                res.push(lineArcUnit);
            }else{
                const r1=0.5*Math.abs(a.y-b.y);
                const r2=0.5*Math.abs(b.x-c.x);
                const rMin=r1>r2?r2:r1;
                const r=this.radius<rMin?this.radius:rMin;
                const delta=r;
                const param1=b.y>a.y?1:-1;
                const param2=c.x>b.x?1:-1;
                prev=new Point(b.x+param2*delta,b.y);
                const lineArcUnit:LineArcUnit={
                    p0:a,
                    p1:new Point(b.x,b.y-param1*delta),
                    arcDraw:{
                        a:b,
                        b:prev,
                        r,
                    }
                }
                res.push(lineArcUnit);
            }
        }
        return res;
    }

}