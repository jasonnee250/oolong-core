import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongNodeDO} from "@/file/OolongNodeDO";
import {PageManager} from "@/page/PageManager";
import {Canvg} from "canvg";
import {OolongNode} from "@/graphics/OolongNode.ts";

export class OolongSVGNode extends OolongNode{

    type:string=OolongNodeType.SVG;

    svgCode:string="";
    imgBitmap:ImageBitmap|null=null;

    constructor(id: string, ctx: CanvasRenderingContext2D) {
        super(id,ctx,false);
    }

    async generateTexture(width?:number,height?:number){
        const cW=width!==undefined?width:this.w;
        const cH=height!==undefined?height:this.h;
        const canvas=new OffscreenCanvas(2*cW,2*cH);
        const ctx=canvas.getContext("2d")!;
        const canvg=await Canvg.from(ctx,this.svgCode);
        await canvg.render();
        this.imgBitmap=canvas.transferToImageBitmap();
        return this;
    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }

    drawOnGLCtx(ctx: CanvasRenderingContext2D) {
        if(this.imgBitmap){
            ctx.drawImage(this.imgBitmap,this.x,this.y,this.w,this.h);
        }
    }

    serializeTo():OolongNodeDO{
        return {
            type: this.type,
            zIndex: this.zIndex,
            id:this.id,
            x:this.x,
            y:this.y,
            h:this.h,
            w:this.w,
            alpha:this.alpha,
            color:this.color,
            fontColor:this.fontColor,
            fontSize:this.fontSize,
            fontFamily:this.fontFamily,
            borderAlpha:this.borderAlpha,
            borderWidth:this.borderWidth,
            borderColor:this.borderColor,
            svgCode:this.svgCode,
        }
    }

    static load(nodeDO: OolongNodeDO, ctx: CanvasRenderingContext2D,_pageManager:PageManager): OolongSVGNode {
        const {id,svgCode, w,h,zIndex,color,alpha, fontColor,fontFamily, fontSize, x, y} = nodeDO;
        const node=new OolongSVGNode(id,ctx);
        node.zIndex=zIndex;
        node.color=color;
        node.alpha=alpha;
        node.fontColor=fontColor;
        node.fontFamily=fontFamily;
        node.fontSize=fontSize;
        node.x=x;
        node.y=y;
        node.w=w;
        node.h = h;
        node.svgCode=svgCode||"";
        node.updateTransformMatrix();
        return node;
    }
}