import {Point} from "dahongpao-core";
import {ToolBarId} from "@/component/toolBar/ToolBar";

export class DragTopBarWorker {

    originPos: Point = new Point();
    originDomPos:Point=new Point();
    isWorking:boolean=false;

    onDown(event:PointerEvent){
        this.isWorking=true;
        this.originPos = new Point(event.clientX,event.clientY);
        const topBarDom = document.getElementById(ToolBarId);
        if (!topBarDom) {
            return;
        }
        const rect = topBarDom.getBoundingClientRect();
        this.originDomPos=new Point(rect.x,rect.y);
    }

    onMove(event:PointerEvent){
        if(!this.isWorking){
            return;
        }
        const topBarDom = document.getElementById(ToolBarId);
        if (!topBarDom) {
            return;
        }
        event.stopPropagation();
        // const rect = topBarDom.getBoundingClientRect();
        const deltaY = event.clientY - this.originPos.y;
        const deltaX = event.clientX - this.originPos.x;
        topBarDom.style.left = (this.originDomPos.x + deltaX) + "px";
        topBarDom.style.top = (this.originDomPos.y + deltaY) + "px";
    }

    onUp(){
        this.isWorking=false;
    }
}