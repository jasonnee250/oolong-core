import {IGraphicLine, Point} from "dahongpao-core";
import {OolongLineType} from "@/graphics/OolongLineType";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType";
import {SelectDrawer} from "@/select/SelectDrawer";

export interface HighLightProps{
    shapeType: OolongLineType;
    points: Point
}
export class HighlightLine extends IGraphicLine{

    graphicContext: CanvasRenderingContext2D;

    highLightProps:HighLightProps[]=[];
    auxiliaryType:AuxiliaryType=AuxiliaryType.HighLightLine;

    constructor(graphicContext: CanvasRenderingContext2D) {
        super("high-line");
        this.graphicContext = graphicContext;
    }

    updateProps(highLightProps:HighLightProps[]){
        this.highLightProps=highLightProps;
    }

    drawOnGLCtx(ctx:CanvasRenderingContext2D):void{
        ctx.save();
        for(const prop of this.highLightProps){
            SelectDrawer.drawHighlightLine(prop.points,prop.shapeType,ctx);
        }
        ctx.restore();
    }

    draw(): void {
        this.drawOnGLCtx(this.graphicContext);
    }




}