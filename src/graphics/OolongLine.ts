import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongLineDO} from "@/file/OolongLineDO";
import {PageManager} from "@/page/PageManager";
import {AffineMatrix, GraphicUtils, IGraphicLine, LineDashType, Point, TextAlignType} from "dahongpao-core";
import {IDrawer} from "@/graphics/IDrawer.ts";
import {CurveDrawer} from "@/graphics/drawer/CurveDrawer.ts";
import {PolyLineDrawer} from "@/graphics/drawer/PolyLineDrawer.ts";
import {SimpleLineDrawer} from "@/graphics/drawer/SimpleLineDrawer.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {QuadBezierCurve} from "@/math/QuadBezierCurve.ts";
import {ControlPoint} from "@/graphics/ControlPoint.ts";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants.ts";
import {OolongGraphicUtils} from "@/graphics/utils/OolongGraphicUtils.ts";
import {OolongText} from "@/text/base/OolongText.ts";
import {Rect} from "@/text/base/Rect.ts";

export class OolongLine extends IGraphicLine {

    graphicContext: CanvasRenderingContext2D;
    type: string = OolongNodeType.Line;
    shapeType: OolongLineType = OolongLineType.Line;
    points: Point[] = [];
    lineDashType:LineDashType=LineDashType.None;

    oolongText:OolongText|null=null;

    static drawerMap: Map<OolongLineType, IDrawer> = new Map<OolongLineType, IDrawer>([
        [OolongLineType.Curve, new CurveDrawer()],
        [OolongLineType.PolyLine, new PolyLineDrawer()],
        [OolongLineType.Line, new SimpleLineDrawer()],
        [OolongLineType.LineArrow, new SimpleLineDrawer()],
    ]);

    constructor(id: string, graphicContext: CanvasRenderingContext2D, shapeType: OolongLineType = OolongLineType.Line) {
        super(id);
        this.graphicContext = graphicContext;
        this.shapeType = shapeType;
    }

    initText():void{
        const pos=this.computeTextPos();
        this.oolongText=new OolongText(this.id+"-text",this.graphicContext,pos,null);
        const rect=Rect.rectNode2Rect(this.getRectNode());
        this.oolongText.limitWidth=rect.width;
        this.oolongText.toNodeId=this.id;
        this.oolongText.horizonAlign=TextAlignType.TOP_OR_LEFT;
        this.oolongText.verticalAlign=TextAlignType.TOP_OR_LEFT;
    }

    getStretchMinSize():Point{
        return new Point(10,10);
    }


    computeTextPos():Point{
        let textRectNode;
        if(this.oolongText){
            textRectNode=Rect.rectNode2Rect(this.oolongText.getRectNode());
        }else{
            textRectNode=new Rect(0,0,0,0);
        }
        const points=this.points;
        if(this.shapeType===OolongLineType.PolyLine){
            const pointsNum=points.length-1;
            const startIndex=Math.floor(0.5*pointsNum);
            const endIndex=startIndex+1;
            const start=points[startIndex];
            const end=points[endIndex];
            const centerPoint=new Point(0.5*(start.x+end.x),0.5*(start.y+end.y));
            return new Point(centerPoint.x-0.5*textRectNode.width,centerPoint.y-0.5*textRectNode.height);
        }else if(this.shapeType===OolongLineType.Curve){
            const centerPoint=points[2];
            return new Point(centerPoint.x-0.5*textRectNode.width,centerPoint.y-0.5*textRectNode.height);
        }else{
            const start=points[0];
            const end=points[points.length-1];
            const centerPoint=new Point(0.5*(start.x+end.x),0.5*(start.y+end.y));
            return new Point(centerPoint.x-0.5*textRectNode.width,centerPoint.y-0.5*textRectNode.height);
        }
    }

    drawOnGLCtx(ctx:CanvasRenderingContext2D):void{
        const type = this.shapeType;
        let drawer = OolongLine.drawerMap.get(type);
        if (!drawer) {
            console.error("取不到drawer，使用line兜底!");
            drawer = OolongLine.drawerMap.get(OolongLineType.Line);
        }
        const hasText=this.oolongText && this.oolongText.hasText();
        if(!hasText){
            drawer!.draw(this, ctx);
        }else{
            const textContentRect=Rect.rectNode2Rect(this.oolongText!.getRectNode());
            ctx.save();
            ctx.fillStyle="#ffffff";
            drawer!.draw(this, ctx);

            ctx.beginPath();
            ctx.fillRect(textContentRect.x,textContentRect.y,
                textContentRect.width,textContentRect.height);
            ctx.beginPath();
            this.oolongText!.drawVisible(this.getRectNode(),ctx);
            ctx.restore();
        }
    }

    draw(): void {
        this.drawOnGLCtx(this.graphicContext);
    }

    getBounds(){
        const points = [...this.points];
        let bounds = GraphicUtils.getBoundsByPoints(points);
        if(this.oolongText){
            const textBounds=this.oolongText.getRectNode();
            bounds=GraphicUtils.getBounds([bounds,textBounds],this.id);
        }
        return bounds;
    }

    getRectNode() {
        const points = [...this.points];
        let bounds = GraphicUtils.getBoundsByPoints(points);
        if(this.oolongText){
            const textBounds=this.oolongText.getRectNode();
            bounds=GraphicUtils.getBounds([bounds,textBounds],this.id);
        }
        bounds.minX = bounds.minX - this.width;
        bounds.minY = bounds.minY - this.width;
        bounds.maxX = bounds.maxX + 2 * this.width;
        bounds.maxY = bounds.maxY + 2 * this.width;
        bounds.id = this.id;
        return bounds;
    }

    drawArrow(ctx: CanvasRenderingContext2D) {
        const points = this.points;
        if (points.length === 0) {
            console.error("line has no point!");
            return;
        }
        if (this.rArrow) {
            const n = this.points.length;
            const start = this.points[n - 2];
            const end = this.points[n - 1];
            const {a, b} = this.getRArrowPoint(start, end, 10);
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(end.x, end.y);
            ctx.lineTo(b.x, b.y);
        }
        if (this.lArrow) {
            const start = this.points[0];
            const end = this.points[1];
            const {a, b} = GraphicUtils.getLArrowPoint(start, end, 10);
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(start.x, start.y);
            ctx.lineTo(b.x, b.y);
        }
    }

    getRArrowPoint(start: Point, end: Point, l: number = 5) {
        const distance = GraphicUtils.distance(start, end);
        const p1 = new Point(distance - Math.sqrt(3) * 0.5 * l, 0.5 * l);
        const p2 = new Point(distance - Math.sqrt(3) * 0.5 * l, -0.5 * l);
        return this.basicGetArrowPoint(start, end, p1, p2);
    }

    basicGetArrowPoint(start: Point, end: Point, p1: Point, p2: Point) {
        const lineAngle = GraphicUtils.lineAngle(start, end);
        const m = AffineMatrix.generateMatrix()
            .translate(start.x, start.y)
            .rotate2(lineAngle);
        const a = m.crossPoint(p1);
        const b = m.crossPoint(p2);
        return {a, b};
    }

    serializeTo(): OolongLineDO {
        return {
            type: this.type,
            shapeType: this.shapeType,
            zIndex: this.zIndex,
            id: this.id,
            alpha: this.alpha,
            color: this.color,
            fontColor: this.fontColor,
            fontSize: this.fontSize,
            width: this.width,
            lArrow: this.lArrow,
            rArrow: this.rArrow,
            points: OolongGraphicUtils.clonePoints(this.points),
            lineDashType:this.lineDashType,
            oolongText:this.oolongText?.serializeTo(),
        }
    }

    static load(nodeDO: OolongLineDO, ctx: CanvasRenderingContext2D, pageManager: PageManager): OolongLine {
        const {type, shapeType, id,oolongText,lineDashType, width, points, lArrow, rArrow, zIndex, color, alpha, fontColor, fontSize} = nodeDO;
        const node = new OolongLine(id, ctx);
        node.type = type;
        node.shapeType = shapeType;
        node.zIndex = zIndex;
        node.color = color;
        node.alpha = alpha;
        node.fontColor = fontColor;
        node.fontSize = fontSize;
        node.points = points || [];
        node.lArrow = lArrow;
        node.rArrow = rArrow;
        node.width = width;
        node.lineDashType=lineDashType;
        if(oolongText){
            node.oolongText=OolongText.load(oolongText,ctx,pageManager);
        }
        return node;
    }

    getControlPoints(): ControlPoint[] {
        if (this.shapeType !== OolongLineType.PolyLine) {
            return [];
        }
        const points = this.points;
        const cpPoints: ControlPoint[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            const p = points[i];
            const q = points[i + 1];
            const distance = GraphicUtils.distance(p, q);
            if (distance < LinePadding+2) {
                continue;
            }
            const cp = new ControlPoint(0.5 * (p.x + q.x), 0.5 * (p.y + q.y));
            cp.isHorizon=InteractiveUtils.judgeHorizon(p,q);
            cpPoints.push(cp);
        }
        return cpPoints;
    }

    contains(point: Point) {
        const buffer = 6;
        if(this.oolongText){
            const textRect =this.oolongText.getRectNode() ;
            if(GraphicUtils.rectContains2(point,textRect)){
                return true;
            }
        }
        if (this.shapeType === OolongLineType.PolyLine) {
            const points = this.points;

            for (let i = 0; i < points.length - 1; i++) {
                const p = points[i];
                const q = points[i + 1];
                const isHorizon = InteractiveUtils.judgeHorizon(p, q);
                if (isHorizon) {
                    if (Math.abs(point.y - p.y) < buffer && (point.x - p.x) * (point.x - q.x) < 0) {
                        return true;
                    }
                } else {
                    if (Math.abs(point.x - p.x) < buffer && (point.y - p.y) * (point.y - q.y) < 0) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (this.shapeType === OolongLineType.Line) {
            const start = this.points[0];
            const end = this.points[this.points.length - 1];
            const isVertical = InteractiveUtils.judgeVertical(start, end);
            if (isVertical) {
                if (Math.abs(point.x - start.x) < buffer && (point.y - start.y) * (point.y - end.y) < 0) {
                    return true;
                }
            }
            const k = (end.y - start.y) / (end.x - start.x);
            const yp = k * (point.x - start.x) + start.y;
            const dl = (yp - point.y) / Math.sqrt(1 + k * k);
            if (Math.abs(dl) < buffer) {
                return true;
            }
            return false;
        }
        if (this.shapeType === OolongLineType.Curve) {
            const curve1 = new QuadBezierCurve(this.points[0], this.points[1], this.points[2]);
            const res = curve1.solve(point, buffer);
            if (res) {
                return true;
            }
            const curve2 = new QuadBezierCurve(this.points[2], this.points[3], this.points[4]);
            return curve2.solve(point, buffer);
        }
        return true;
    }


}