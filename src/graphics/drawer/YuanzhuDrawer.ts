import {IDrawer} from "@/graphics/IDrawer";
import {GraphicNode, LineDashType} from "dahongpao-core";
import {Rect} from "@/text/base/Rect";
import {NodeTextPadding} from "@/text/config/OolongTextConstants";

export class YuanzhuDrawer implements IDrawer{


    path2:any[]=[
        { x: 0.5000036589114008, y: 0.4451193111481068 },
        {
            control1: { x: 0.35344718239429407, y: 0.4451193111481068 },
            control2: { x: 0.22348081998643765, y: 0.4152991468627847 },
            end: { x: 0.1321836627166686, y: 0.369651122372441 }
        },
        {
            control1: { x: 0.03763739212309552, y: 0.322377929419513 },
            control2: { x: 0.000027441835505084704, y: 0.2672246513358092 },
            end: { x: 0, y: 0.22260722148027542 }
        },
        { x: 0, y: 0.22251087002921038 },
        {
            control1: { x: 0.000027441835505084704, y: 0.1778934401736766 },
            control2: { x: 0.03763739212309552, y: 0.12274016208997277 },
            end: { x: 0.1321836627166686, y: 0.07546696913704472 }
        },
        {
            control1: { x: 0.22348081998643765, y: 0.029818334827390658 },
            control2: { x: 0.35344718239429407, y: 0 },
            end: { x: 0.5000036589114008, y: 0 }
        },
        {
            control1: { x: 0.6465552568799731, y: 0 },
            control2: { x: 0.7765197898321292, y: 0.029818334827390658 },
            end: { x: 0.8678218256504325, y: 0.07546696913704472 }
        },
        {
            control1: { x: 0.9623985871723447, y: 0.12275662721135726 },
            control2: { x: 1, y: 0.17793307842886155 },
            end: { x: 1, y: 0.2225590457547429 }
        },
        {
            control1: { x: 1, y: 0.2671850130806243 },
            control2: { x: 0.9623985871723447, y: 0.32236085447881796 },
            end: { x: 0.8678218256504325, y: 0.369651122372441 }
        },
        {
            control1: { x: 0.7765197898321292, y: 0.4152991468627847 },
            control2: { x: 0.6465552568799731, y: 0.4451193111481068 },
            end: { x: 0.5000036589114008, y: 0.4451193111481068 }
        },
    ]

    path3=[
        { x: 1, y: 0.2225590457547429 },
        {
            control1: { x: 1, y: 0.2671850130806243 },
            control2: { x: 0.9623985871723447, y: 0.32236085447881796 },
            end: { x: 0.8678218256504325, y: 0.369651122372441 }
        },
        {
            control1: { x: 0.7765197898321292, y: 0.4152991468627847 },
            control2: { x: 0.6465552568799731, y: 0.4451193111481068 },
            end: { x: 0.5000036589114008, y: 0.4451193111481068 }
        },

        { x: 0.5000036589114008, y: 0.4451193111481068 },
        {
            control1: { x: 0.35344718239429407, y: 0.4451193111481068 },
            control2: { x: 0.22348081998643765, y: 0.4152991468627847 },
            end: { x: 0.1321836627166686, y: 0.369651122372441 }
        },
        {
            control1: { x: 0.03763739212309552, y: 0.322377929419513 },
            control2: { x: 0.000027441835505084704, y: 0.2672246513358092 },
            end: { x: 0, y: 0.22260722148027542 }
        },
        { x: 0, y: 0.22251087002921038 },
        { x: 0, y: 0.7671648890433764 },
        {
            control1: { x: 0, y: 0.8156760151966972 },
            control2: { x: 0.039035096278155317, y: 0.87321856533909 },
            end: { x: 0.13290263880690217, y: 0.9218943427062563 }
        },
        {
            control1: { x: 0.22402843705940614, y: 0.9691431428867627 },
            control2: { x: 0.3537307480278468, y: 1 },
            end: { x: 0.5000036589114008, y: 1 }
        },
        {
            control1: { x: 0.6462747403392544, y: 1 },
            control2: { x: 0.775977051307695, y: 0.9691431428867627 },
            end: { x: 0.8671022397416319, y: 0.9218943427062563 }
        },
        {
            control1: { x: 0.9609655135404115, y: 0.87321856533909 },
            control2: { x: 1, y: 0.8156760151966972 },
            end: { x: 1, y: 0.7671648890433764 }
        },
        { x: 1, y: 0.2225590457547429 }
    ]

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

        this.travelPath(this.path2,node,ctx);

        this.travelPath(this.path3,node,ctx);

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

    textContentBounds(node: any): Rect {
         // 计算椭圆内接矩形
         const padding = 10;
         const width = node.w - padding * 2;
         const a = Math.max(node.w , node.h * 0.4451193111481068) / 2;
         const b = Math.min(node.w , node.h * 0.4451193111481068) / 2;
         const m = (1 - ((width / 2) ** 2) / (a ** 2)) * (b **2);
         const y = node.h * 0.4451193111481068;
         const innerRect = {
             x: padding,
             y,
             width,
             height: node.h * 0.7671648890433764 + Math.sqrt(m) - y,
         };
        return {
            x: node.x + innerRect.x + NodeTextPadding,
            y: node.y + innerRect.y + NodeTextPadding,
            width: innerRect.width - NodeTextPadding * 2,
            height: innerRect.height - NodeTextPadding * 2,
        };
    }

    travelPath(path:any,node:GraphicNode,ctx:CanvasRenderingContext2D){
        ctx.moveTo(node.x+node.w*path[0].x,node.y+node.h*path[0].y);
        for(let i=1;i<path.length;i++){
            const p=path[i];
            if(p.end){
                ctx.bezierCurveTo(node.x+node.w*p.control1.x,node.y+node.h*p.control1.y,
                    node.x+node.w*p.control2.x,node.y+node.h*p.control2.y,
                    node.x+node.w*p.end.x,node.y+node.h*p.end.y);
            }else{
                ctx.lineTo(node.x+node.w*p.x, node.y+node.h*p.y);
            }
        }
    }

}