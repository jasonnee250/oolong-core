import {Page} from "@/page/Page";
import {pageDistance, pageLeft, pageTop} from "@/page/PageConfig.ts";
import {
    Application,
    EventContext,
    InteractiveEvent,
    NodeDetector,
    WheelEventPlugin
} from "dahongpao-canvas";
import {PageDO} from "@/file/PageDO.ts";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {WindowResizePlugin} from "dahongpao-canvas";
import {IGraphicElement, RectNode} from "dahongpao-core";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongText} from "@/text/base/OolongText.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {DocState} from "@/app/DocState.ts";
import {DocMode} from "@/file/DocSettingDO.ts";

export class PageManager {
    pages:Page[]=[];
    pageApplication: Application;
    pageCtx:EventContext;

    docState:DocState;

    constructor(docState:DocState) {
        this.docState=docState;
        this.pages=[];
        this.pageApplication = new Application();
        //page ctx
        const pageCtx: EventContext = {
            nodeManager: this.pageApplication.nodeManager,
            gmlRender: this.pageApplication.gmlRender,
            detectors: new Map([[OolongDetectorEnum.Node, new NodeDetector()]]),
        }
        this.pageCtx=pageCtx;
        //page application add
        const wheelPlugin2 = new WheelEventPlugin(pageCtx);
        const resizePlugin=new WindowResizePlugin(this.pageApplication);
        this.pageApplication.registerPlugin(wheelPlugin2);
        this.pageApplication.registerPlugin(resizePlugin);
    }

    start():void{
        this.pageApplication.start();
    }

    stop():void{
        this.pageApplication.stop();
        this.pageApplication.nodeManager.clear();
        this.pages=[];
    }

    findNextPage(page:Page):Page{
        for(let i=0;i<this.pages.length-1;i++){
            const curPage=this.pages[i];
            if(page===curPage){
                return this.pages[i+1];
            }
        }
        this.addPage();
        return this.pages[this.pages.length-1];
    }

    addPage():void{
        const canvas=this.pageApplication.gmlRender.canvas!;
        const glCtx=canvas.getContext("2d")!;
        const page=Page.generateA4Page(this.genPageId(),glCtx,this.pageDefine);
        let y=pageTop;
        if(this.pages.length>0){
            const prevPage=this.pages[this.pages.length-1];
            y=prevPage.y+prevPage.h+pageDistance;
        }
        page.x=pageLeft;
        page.y=y;
        this.pages.push(page);
        this.pageApplication.nodeManager.addNode(page);
        page.draw();
    }

    getPage(pageId:string):Page|null{
        for(let i=0;i<this.pages.length;i++){
            const curPage=this.pages[i];
            if(pageId===curPage.id){
                return curPage;
            }
        }
        return null;
    }


    genPageId():string{
        return "page-"+this.pages.length;
    }

    onPage(event:InteractiveEvent):boolean{
        return true;
    }

    getPageOfflineCanvas(scale:number=4,page:Page,oolongApp:Application){
        const offlineCanvas=document.createElement("canvas");
        offlineCanvas.width=scale*page.w;
        offlineCanvas.height=scale*page.h;

        const ctx=offlineCanvas.getContext("2d")!;
        ctx.scale(scale,scale);
        ctx.translate(-page.x,-page.y);
        const rectNode:RectNode={
            id:"offline-rect",minX:page.x,minY:page.y,maxX:page.x+page.w,maxY:page.y+page.h
        }

        const graphics=oolongApp.nodeManager.searchNodes(rectNode.minX,rectNode.minY,rectNode.maxX,rectNode.maxY) as IGraphicElement[];
        page.drawOnGLCtx(ctx);
        for(const g of graphics){
            if(g instanceof OolongNode){
                g.drawOnGLCtx(ctx);
            }else if(g instanceof OolongText){
                g.drawVisible(rectNode,ctx);
            }else if(g instanceof OolongLine){
                g.drawOnGLCtx(ctx);
            }
        }
        return offlineCanvas;
    }

    getPageBlob(scale:number=4,page:Page,oolongApp:Application):string{
        const offlineCanvas=document.createElement("canvas");
        offlineCanvas.width=scale*page.w;
        offlineCanvas.height=scale*page.h;

        const ctx=offlineCanvas.getContext("2d")!;
        ctx.scale(scale,scale);
        ctx.translate(-page.x,-page.y);
        const rectNode:RectNode={
            id:"offline-rect",minX:page.x,minY:page.y,maxX:page.x+page.w,maxY:page.y+page.h
        }

        const graphics=oolongApp.nodeManager.searchNodes(rectNode.minX,rectNode.minY,rectNode.maxX,rectNode.maxY) as IGraphicElement[];
        page.drawOnGLCtx(ctx);
        for(const g of graphics){
            if(g instanceof OolongNode){
                g.drawOnGLCtx(ctx);
            }else if(g instanceof OolongText){
                g.drawVisible(rectNode,ctx);
            }else if(g instanceof OolongLine){
                g.drawOnGLCtx(ctx);
            }
        }
        const blobUrl=offlineCanvas.toDataURL('image/png',1);

        return blobUrl;
    }

    reset():void{
        this.pages=[];
        this.pageApplication.nodeManager.clear();
        this.pageApplication.gmlRender.reset();
    }

    load(pageDOList:PageDO[]):void{
        const canvas=this.pageApplication.gmlRender.canvas!;
        const glCtx=canvas.getContext("2d")!;
        for(const pageDO of pageDOList){
            const page=Page.load(pageDO,glCtx);
            this.pages.push(page);
            this.pageApplication.nodeManager.addNode(page);
            page.draw();
        }

    }

}