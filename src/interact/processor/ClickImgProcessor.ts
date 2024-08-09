import {IProcessor, InteractiveEvent} from "dahongpao-canvas";
import {ToolEnum} from "@/tool/ToolEnum";
import {OolongImage} from "@/image/OolongImage";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";

export class ClickImgProcessor implements IProcessor {
    canBeExit(event: InteractiveEvent, eventCtx: OolongEventContext): boolean {
        return true;
    }
    canBeEnable(event: InteractiveEvent, eventCtx: OolongEventContext): boolean {
        if(event.type!=='pointerdown'){
            return false;
        }
        if(!eventCtx.onPage(event)){
            return false;
        }
        if (event.originEvent.target !== eventCtx.gmlRender.canvas
            && event.originEvent.target !== eventCtx.auxiliaryCtx.gmlRender.canvas) {
            return false;
        }
        return eventCtx.toolManager.currentTool == ToolEnum.IMAGE;
    }
    process(event: InteractiveEvent, ctx: OolongEventContext): void {
        const viewBounds=ctx.gmlRender.getViewPortBounds();

        const page=ctx.pageManager.pages[0];
        const interactRect=InteractiveUtils.interactRect(page.getRectNode(),viewBounds);

        const glCtx = ctx.gmlRender.canvas!.getContext("2d")!;
        const id = "node-" + ctx.nodeManager.nodeMap.size;
        const img = new OolongImage(id, glCtx);
        img.x=event.globalPoint.x;
        img.y=event.globalPoint.y;
        img.containerRect=interactRect;
        img.zIndex=ctx.nodeManager.nodeMap.size;
        img.src=ctx.imageManager.upLoadImg.url;
        img.firstDraw();
        ctx.nodeManager.addNode(img);
        ctx.toolManager.resetTool();
    }

}

