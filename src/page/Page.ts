import {CanvasGraphicNode} from "dahongpao-canvas";
import {PageDO} from "@/file/PageDO.ts";
import {A4PageDefine, PageDefine} from "@/component/rightTopTool/pageSetting/PageSettingConfig.ts";
export class Page extends CanvasGraphicNode{
    id:string;
    pageDefine:PageDefine;

    constructor(id:string,ctx: CanvasRenderingContext2D,pageDefine:PageDefine) {
        super(id,ctx);
        this.id=id;
        this.pageDefine=pageDefine;
        this.w=pageDefine.width;
        this.h = pageDefine.height;
    }

    static generateA4Page(id:string,ctx: CanvasRenderingContext2D,pageDefine:PageDefine){
        const page=new Page(id,ctx,pageDefine);
        page.borderAlpha=0;
        // page.color="#ffffff";
        return page;
    }

    updatePageDefine(pageDefine:PageDefine):void{
        this.pageDefine=pageDefine;
        this.w=pageDefine.width;
        this.h=pageDefine.height;
    }

    serializeTo(): PageDO{
        return {
            id:this.id,
            x:this.x,
            y:this.y,
            w:this.w,
            h:this.h,
            borderAlpha:this.borderAlpha,
            pageDefine:this.pageDefine,
        }
    }

    static load(pageDO:PageDO,ctx: CanvasRenderingContext2D):Page{
        const {x,y,w,h,borderAlpha,pageDefine}=pageDO;
        let cahcePage=pageDefine;
        /** 删档时候需修改这块 */
        if(!cahcePage){
            cahcePage=A4PageDefine;
        }
        const page=new Page(pageDO.id,ctx,cahcePage);
        page.x=x;
        page.y=y;
        page.w=w;
        page.h=h;
        page.borderAlpha=borderAlpha;
        return page;
    }

}