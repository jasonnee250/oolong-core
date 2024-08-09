import {OolongNode} from "@/graphics/OolongNode";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {PageManager} from "@/page/PageManager.ts";
export class OolongImgNode extends OolongNode{

    type:string=OolongNodeType.IMG;

    imgSrc:string="";
    img: HTMLImageElement;

    constructor(id: string, ctx: CanvasRenderingContext2D) {
        super(id,ctx);
        this.img = new Image();
        this.img.crossOrigin="anonymous";
    }

    loadImg(resetSize:boolean=false){
        return new Promise<OolongImgNode>((resolve,reject)=>{
            this.img.src=this.imgSrc;
            this.img.onload = () => {
                if(resetSize){
                    this.w=0.5*this.img.width;
                    this.h=0.5*this.img.height;
                }
                resolve(this);
            };
            //todo 兜底图展示
            this.img.onerror=()=>{
                console.error("图片下载失败，用兜底图展示，图片token：",this.img.src);
                reject(this);
            }
        });
    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }

    drawOnGLCtx(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img,this.x,this.y,this.w,this.h);
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
            imgSrc:this.imgSrc,
        }
    }

    static load(nodeDO: OolongNodeDO, ctx: CanvasRenderingContext2D,_pageManager:PageManager): OolongImgNode {
        const {id,imgSrc, w,h,zIndex,color,alpha, fontColor,fontFamily, fontSize, x, y} = nodeDO;
        const node=new OolongImgNode(id,ctx);
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
        node.imgSrc=imgSrc||"";
        node.updateTransformMatrix();
        return node;
    }

}