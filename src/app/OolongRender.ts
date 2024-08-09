import {CanvasRender} from "dahongpao-canvas";
import {AffineMatrix, GraphicNode, Point, RectNode} from "dahongpao-core";
import {OolongText} from "@/text/base/OolongText";

export class OolongRender extends CanvasRender{


    dirtyDraw(bounds: RectNode,graphicList:GraphicNode[]){
        const ctx = this.canvas!.getContext("2d")!;
        //清空；
        ctx.clearRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
        ctx.save();
        ctx.beginPath();
        ctx.rect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
        ctx.clip();
        const textBufferedRect=this._bufferBounds(bounds);
        for (const graphic of graphicList) {
            if(graphic instanceof OolongText){
                (graphic as OolongText).drawVisible(textBufferedRect);
            }else{
                graphic.draw();
            }
        }
        ctx.restore();
    }

    _bufferBounds(bounds: RectNode,buffer:number=10): RectNode {
        const scale = this.globalTransform.a / 2;
        return {
            id:"textBufferBounds",
            minX : Math.round((bounds.minX) * scale - buffer) / scale,
            minY : Math.round((bounds.minY) * scale - buffer) / scale,
            maxX : Math.round((bounds.maxX) * scale + 2 * buffer) / scale,
            maxY : Math.round((bounds.maxY) * scale + 2 * buffer) / scale,
        }

    }

    scaleToCenter(scaleNumber:number):void{
        const scale=this.getScale();
        const sx=scaleNumber/scale;
        const viewBounds=this.getViewPortBounds();
        const centerPoint=new Point(0.5*(viewBounds.minX+viewBounds.maxX),
            0.5*(viewBounds.minY+viewBounds.maxY));
        this.scale(sx,sx,centerPoint);
    }
}