import {OolongLine} from "@/graphics/OolongLine";
import {Point} from "dahongpao-core";
import {Rect} from "@/text/base/Rect.ts";
import {HoverDrawer} from "@/interact/default/normal/HoverDrawer.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";

export class SelectDrawer {

    static drawSelectPolyLine(glCtx: CanvasRenderingContext2D, node: OolongLine,scale:number=1) {
        glCtx.strokeStyle = "#153fea";
        glCtx.fillStyle = '#ffffff';
        glCtx.lineWidth=1;
        const cpPoints = node.getControlPoints();
        const endPoints:Point[]=[]
        endPoints.push(node.points[0]);
        endPoints.push(node.points[node.points.length-1]);
        for(const p of endPoints){
            glCtx.beginPath();
            glCtx.ellipse(p.x, p.y, 5, 5, 0, 0, 2 * Math.PI, false);
            glCtx.closePath();
            glCtx.fill();
            glCtx.stroke();
        }
        glCtx.lineWidth=4;
        for (const p of cpPoints) {
            glCtx.beginPath();
            if(p.isHorizon){
                glCtx.moveTo(p.x-5, p.y);
                glCtx.lineTo(p.x+5, p.y);
            }else{
                glCtx.moveTo(p.x, p.y-5);
                glCtx.lineTo(p.x, p.y+5);
            }
            glCtx.closePath();
            glCtx.stroke();
        }
    }

    static drawSelectSimpleLine(glCtx: CanvasRenderingContext2D, node: OolongLine) {
        glCtx.strokeStyle = "#153fea";
        glCtx.fillStyle = '#ffffff';
        glCtx.lineWidth=1;
        const cpPoints = [];
        cpPoints.unshift(node.points[0]);
        cpPoints.push(node.points[node.points.length-1]);
        HoverDrawer.drawLine(node.points,node.shapeType,'#647ee5',2,1,glCtx);
        for (const p of cpPoints) {
            glCtx.beginPath();
            glCtx.ellipse(p.x, p.y, 5, 5, 0, 0, 2 * Math.PI, false);
            glCtx.closePath();
            glCtx.fill();
            glCtx.stroke();
        }
    }

    static drawSelectCurveLine(glCtx: CanvasRenderingContext2D, node: OolongLine) {
        glCtx.strokeStyle = "#153fea";
        glCtx.fillStyle = '#ffffff';
        glCtx.lineWidth=1;
        const points = node.points;
        HoverDrawer.drawLine(node.points,node.shapeType,'#647ee5',2,1,glCtx);
        for (let i=0;i<points.length;i=i+2) {
            const p=points[i];
            glCtx.beginPath();
            glCtx.ellipse(p.x, p.y, 5, 5, 0, 0, 2 * Math.PI, false);
            glCtx.closePath();
            glCtx.fill();
            glCtx.stroke();
        }
    }

    static drawBounds(glCtx:CanvasRenderingContext2D,rect:Rect){
        glCtx.strokeStyle = '#153fea';
        glCtx.lineWidth = 1;
        glCtx.globalAlpha = 1;
        glCtx.strokeRect(rect.x, rect.y,
            rect.width, rect.height);
    }

    static drawSelectBounds(glCtx: CanvasRenderingContext2D, rect: Rect) {
        glCtx.strokeStyle = '#153fea';
        glCtx.lineWidth = 1;
        glCtx.globalAlpha = 1;
        glCtx.strokeRect(rect.x, rect.y,
            rect.width, rect.height);
        glCtx.fillStyle = '#ffffff';
        const buffer = 2.5;
        const points: Point[] = [
            new Point(rect.x, rect.y),
            new Point(rect.x + rect.width, rect.y),
            new Point(rect.x, rect.y + rect.height),
            new Point(rect.x + rect.width, rect.y + rect.height),
        ]
        for (const p of points) {
            glCtx.fillRect(p.x - buffer, p.y - buffer, 2 * buffer, 2 * buffer);
            glCtx.strokeRect(p.x - buffer, p.y - buffer, 2 * buffer, 2 * buffer);
        }
    }

    static drawHighlightLine(points:Point[],shapeType:OolongLineType,ctx:CanvasRenderingContext2D){
        if(shapeType===OolongLineType.Curve){
            if (points.length < 3) {
                return;
            }
            let start = points[0];

            ctx.beginPath();
            ctx.strokeStyle = "#647ee5";
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2;
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
            ctx.strokeStyle = "#647ee5";
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2;
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
            ctx.strokeStyle = "#647ee5";
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2;
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

        }
    }

}