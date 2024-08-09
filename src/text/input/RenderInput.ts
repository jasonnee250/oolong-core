import {GMLRender} from "dahongpao-core/dist/render/GMLRender";
import { Point} from "dahongpao-core";
import {Application} from "dahongpao-canvas";
import {RenderCursorNode} from "@/text/input/RenderCursorNode.ts";

export class RenderInput {

    renderDom:HTMLInputElement|null=null;
    inputDom: HTMLInputElement | null = null;
    renderCursorHeight: number = 14;

    // renderNode: RenderCursorNode | null = null;
    auxiliaryApp:Application|null=null;

    timeStep=0;
    isFocusing:boolean=false;

    // animationDrawCursor=()=>{
    //     if(this.isFocusing){
    //         this.timeStep++;
    //         if(this.timeStep===1){
    //             this.renderNode?.draw();
    //         }else if(this.timeStep===18){
    //             this.renderNode?.clear();
    //         }else if(this.timeStep>36){
    //             this.timeStep=0;
    //         }
    //     }
    //     requestAnimationFrame(this.animationDrawCursor);
    // }

    init(inputDom: HTMLInputElement, auxiliaryApp: Application,renderDom:HTMLDivElement): void {
        this.inputDom = inputDom;
        const glCtx = auxiliaryApp.gmlRender.canvas!.getContext('2d')!;
        // const renderNode = new RenderCursorNode(glCtx,this.renderCursorHeight);
        // this.renderNode = renderNode;
        this.renderDom=renderDom;
        // auxiliaryApp.nodeManager.addNode(renderNode);
        this.auxiliaryApp=auxiliaryApp;
        // this.animationDrawCursor();
    }

    focus(fontSize:number): void {
        setTimeout(() => {
            this.inputDom!.focus();
        }, 30);
        this.isFocusing=true;
        // this.renderNode!.alpha=1;
        // this.renderNode!.h=fontSize;
        // this.renderNode?.draw();
        this.renderCursorHeight = fontSize;
        document.body.style.cursor = 'text';
        // this.renderDom!.style.display='unset';
        // this.auxiliaryApp!.nodeManager.removeIndexNode(this.renderNode!.getRectNode());
        // this.auxiliaryApp!.nodeManager.addIndexNode(this.renderNode!.getRectNode());

    }

    blur(): void {
        this.isFocusing=false;
        // this.renderNode!.alpha=0;
        this.inputDom!.blur();
        // this.renderDom!.style.display='none';
        this.renderDom!.style.display='none';
        // this.renderNode!.clear();
        document.body.style.cursor = 'default';
    }

    updateCursor(globalPoint: Point, gmlRender: GMLRender,paraHeight:number) {
        const localPoint = gmlRender.globalTransform.crossPoint(globalPoint);
        const canvasRect = gmlRender.canvas!.getBoundingClientRect()!;
        const ratio = window.devicePixelRatio;
        let x = localPoint.x / ratio + canvasRect.x;
        let y = localPoint.y / ratio + canvasRect.y;
        if(x>canvasRect.width){
            x=0;
        }
        if(y>canvasRect.height){
            y=0;
        }
        this.inputDom!.style.left = x + "px";
        this.inputDom!.style.top = y + "px";

        this.renderDom!.style.left=x+"px";
        this.renderDom!.style.top=y+"px";
        this.renderDom!.style.display='unset';
        this.renderDom!.style.height=paraHeight*gmlRender.getScale()*0.5+'px';

        // this.renderNode!.clear();
        // this.renderNode!.w=2;
        // this.renderNode!.h = paraHeight;
        // this.renderNode!.x = globalPoint.x;
        // this.renderNode!.y = globalPoint.y;
        // this.renderNode?.draw();
        // this.auxiliaryApp!.nodeManager.removeIndexNode(this.renderNode!.getRectNode());
        // this.auxiliaryApp!.nodeManager.addIndexNode(this.renderNode!.getRectNode());
    }


}