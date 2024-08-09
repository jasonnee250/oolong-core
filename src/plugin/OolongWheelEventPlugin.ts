import {InteractiveUtils, WheelEventPlugin} from "dahongpao-canvas";
import {GraphicUtils, Point, RectNode} from "dahongpao-core";
import {WheelUtils} from "@/plugin/WheelUtils.ts";
import {OolongEventContext} from "@/interact/OolongEventContext.ts";
import store from "@/store/RootStore.ts";
import {MenuType, setToolMenu} from "@/store/reducer/ToolMenuStateReducer.ts";
import {Rect} from "@/text/base/Rect.ts";
import {OolongSVGNode} from "@/graphics/OolongSVGNode.ts";

export class OolongWheelEventPlugin extends WheelEventPlugin {

    constructor(eventCtx:OolongEventContext) {
        super(eventCtx);
    }

    timer:any;
    onWheel = (event: WheelEvent) => {
        const ctx=this.eventCtx as OolongEventContext;
        if (event.target === ctx.gmlRender.canvas) {
            event.preventDefault();
        }
        if (event.ctrlKey) {
            const clientPoint=new Point(event.clientX,event.clientY);
            const globalPoint=ctx.gmlRender.transformToGlobal(clientPoint);
            WheelUtils.zoomScale(event.deltaY,ctx.gmlRender,ctx.nodeManager,globalPoint);
        } else {
            //平移
            WheelUtils.scroll(event.deltaX,event.deltaY,ctx.gmlRender,ctx.nodeManager);
        }
        const toolInfo = store.getState().toolMenuState.info;
        if(toolInfo.menuType!==MenuType.None){
            store.dispatch(setToolMenu({x: 0, y: 0, menuType: MenuType.None}));
        }
        //修正光标
        if(ctx.inputManager.typeWriter?.oolongText){
            ctx.inputManager.typeWriter.updateEditPositionCursor();
        }

        if(this.timer){
            clearTimeout(this.timer);
        }
        this.timer=setTimeout(()=>{
            this.reCalculateMenu();
            this.generateImgAndDraw();
        },300);
    }

    generateImgAndDraw(){
        const ctx=this.eventCtx as OolongEventContext;
        const nodeMap=ctx.nodeManager.nodeMap;
        const scale=ctx.gmlRender.getScale();
        for(const [_,v] of nodeMap){
            if(v instanceof OolongSVGNode){
                v.generateTexture(scale*v.w,scale*v.h).then(p=>{
                    const bounds=GraphicUtils.getBounds([p.getRectNode()]);
                    InteractiveUtils.bufferBounds(bounds, ctx,5);
                    const graphics = InteractiveUtils.needDrawByMoving(ctx,bounds,new Set<string>(),p);
                    ctx.gmlRender.dirtyDraw(bounds, graphics);
                });
            }
        }
    }


    reCalculateMenu(){
        const oolongCtx=this.eventCtx as OolongEventContext;
        oolongCtx.auxiliaryManager.renderToolMenu();
        oolongCtx.actionManager.renderManager.addAuxiliaryDrawTask();

    }
}
