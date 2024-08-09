import {GraphicUtils, IGraphicLine, Point} from "dahongpao-core";
import {OolongLineType} from "@/graphics/OolongLineType";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {ControlPoint} from "@/graphics/ControlPoint.ts";
import {LinePadding} from "@/interact/default/connectLine/layout/LineLayoutConstants.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {SelectDrawer} from "@/select/SelectDrawer.ts";

export class HoverLine extends IGraphicLine {

    graphicContext: CanvasRenderingContext2D;
    shapeType: OolongLineType = OolongLineType.Line;
    points: Point[] = [];

    auxiliaryType:AuxiliaryType=AuxiliaryType.HoverLine;

    constructor(graphicContext: CanvasRenderingContext2D) {
        super("hover-line");
        this.graphicContext = graphicContext;
    }

    updateProps(shapeType: OolongLineType,points:Point[]){
        this.shapeType=shapeType;
        this.points=points;
    }

    drawOnGLCtx(ctx:CanvasRenderingContext2D):void{
        const points=this.points;
        const shapeType=this.shapeType;
        ctx.save();
        SelectDrawer.drawHighlightLine(points,shapeType,ctx);
        ctx.restore();
    }

    draw(): void {
        this.drawOnGLCtx(this.graphicContext);
    }

}