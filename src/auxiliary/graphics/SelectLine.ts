import {GraphicUtils, IGraphicLine, Point} from "dahongpao-core";
import {OolongLineType} from "@/graphics/OolongLineType";
import {SelectDrawer} from "@/select/SelectDrawer";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {ControlPoint} from "@/graphics/ControlPoint.ts";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";

export class SelectLine extends IGraphicLine{

    graphicContext: CanvasRenderingContext2D;
    shapeType: OolongLineType = OolongLineType.Line;
    auxiliaryType:AuxiliaryType=AuxiliaryType.SelectLine;
    points: Point[] = [];
    constructor(graphicContext: CanvasRenderingContext2D) {
        super("select-line");
        this.graphicContext = graphicContext;
    }

    updateProps(shapeType: OolongLineType,points:Point[]){
        this.shapeType=shapeType;
        this.points=points;
    }

    draw() {
        const glCtx=this.graphicContext;
        if(this.shapeType===OolongLineType.PolyLine){
            SelectDrawer.drawSelectPolyLine(glCtx,this);
        }else if (this.shapeType===OolongLineType.Line){
            SelectDrawer.drawSelectSimpleLine(glCtx,this);
        }else if(this.shapeType===OolongLineType.Curve){
            SelectDrawer.drawSelectCurveLine(glCtx,this);
        }
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
}