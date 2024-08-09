import {RenderInput} from "@/text/input/RenderInput.ts";
import {GMLRender} from "dahongpao-core/dist/render/GMLRender";
import {OolongText} from "@/text/base/OolongText.ts";
import {TypeWriter} from "@/text/typeWriter/TypeWriter.ts";
import { Point} from "dahongpao-core";
import {Application, NodeManager} from "dahongpao-canvas";
import {PageManager} from "@/page/PageManager.ts";

export class InputManager {

    gmlRender:GMLRender;
    nodeManager:NodeManager;
    renderInput:RenderInput;
    typeWriter:TypeWriter|null=null;

    constructor(gmlRender:GMLRender,nodeManager:NodeManager) {
        this.gmlRender=gmlRender;
        this.renderInput=new RenderInput();
        this.nodeManager=nodeManager;
    }

    loadTypeWriter(text:OolongText,pageManager:PageManager){
        this.typeWriter=new TypeWriter(text,this.gmlRender,this.renderInput,this.nodeManager,pageManager);
    }


    init(inputDom:HTMLInputElement,auxiliaryApp:Application,renderDom:HTMLDivElement){
        this.renderInput?.init(inputDom,auxiliaryApp,renderDom);
    }

    onlyInputFocus(clientPoint:Point){
        setTimeout(() => {
            this.renderInput.inputDom!.focus();
        }, 30);
        this.renderInput.inputDom!.style.left = clientPoint.x + "px";
        this.renderInput.inputDom!.style.top = clientPoint.y + "px";
    }

    focus(){
        if(!this.typeWriter){
            return;
        }
        this.typeWriter.updateEditPositionCursor();
        const fontSize=this.typeWriter.editPosition.paragraphPtr!.data!.fontSize!;
        this.renderInput.focus(fontSize);
    }

    focusEnd() {
        if(!this.typeWriter){
            return;
        }
        this.typeWriter.updateEditPositionCursor();
        const fontSize=this.typeWriter.editPosition.paragraphPtr!.data!.fontSize!;
        this.renderInput.focus(fontSize);
    }

    blur(){
        this.renderInput?.blur();

        this.typeWriter=null;
    }

}