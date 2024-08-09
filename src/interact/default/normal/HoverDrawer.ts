import {GraphicUtils, Point} from "dahongpao-core";
import {OolongLineType} from "@/graphics/OolongLineType";
import {OolongNode} from "@/graphics/OolongNode.ts";

export class HoverDrawer {

    static drawLine(points:Point[],shapeType:OolongLineType,color:string,width:number,alpha:number,ctx:CanvasRenderingContext2D) {
        if(shapeType===OolongLineType.Curve){
            if (points.length < 3) {
                return;
            }
            let start = points[0];
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = width;
            for (let i = 1; i < points.length - 1; i = i + 2) {
                ctx.moveTo(start.x, start.y);
                const p1 = points[i];
                const p2 = points[i + 1];
                start = p2;
                ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
            }
            ctx.lineJoin = 'round';
            ctx.stroke();
        }else if(shapeType===OolongLineType.PolyLine){
            if (points.length < 2) {
                return;
            }
            const start = points[0];
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = width;
            ctx.moveTo(start.x, start.y);
            for (let i = 1; i < points.length; i++) {
                const p = points[i];
                ctx.lineTo(p.x, p.y);
            }
            ctx.lineJoin = 'round';
            ctx.stroke();
        }else if(shapeType===OolongLineType.Line){
            if(points.length===0){
                console.error("line has no point!");
                return;
            }
            const start=points[0];
            const end=points.length>1?points[points.length-1]:{...start};
            ctx.beginPath();
            ctx.strokeStyle =  color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = width;
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }

    }

    static drawHoverBounds(glCtx:CanvasRenderingContext2D,node:OolongNode){
        glCtx.strokeStyle = '#647ee5';
        glCtx.lineWidth = 2;
        glCtx.globalAlpha = 1;
        glCtx.strokeRect(node.x, node.y, node.w, node.h);
    }

    static drawConnectPoint(glCtx:CanvasRenderingContext2D,node:OolongNode){
        // glCtx.strokeStyle = '#647ee5';
        glCtx.fillStyle = '#647ee5';
        glCtx.lineWidth = 2;
        glCtx.globalAlpha = 1;
        const points:Point[]=node.getConnectPoint();
        for (const p of points) {
            glCtx.beginPath();
            glCtx.ellipse(p.x, p.y, 5, 5, 0, 0, 2 * Math.PI, false);
            glCtx.closePath();
            glCtx.fill();
            // glCtx.stroke();
        }

    }

}