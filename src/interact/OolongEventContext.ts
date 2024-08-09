import {
    AbsDetector,
    CanvasGraphicNode,
    EventContext,
    InteractiveEvent,
    NodeManager
} from "dahongpao-canvas";
import {GMLRender} from "dahongpao-core/dist/render/GMLRender";
import {ToolManager} from "@/tool/ToolManager";
import {InputManager} from "@/text/input/InputManager.ts";
import {PageManager} from "@/page/PageManager.ts";
import {ImageManager} from "@/image/ImageManager.ts";
import {ActionManager} from "@/action/ActionManager.ts";
import {IActionLog} from "@/action/log/IActionLog.ts";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {AuxiliaryManager} from "@/auxiliary/AuxiliaryManager.ts";
import {CursorManager} from "@/cursor/CursorManager.ts";
import {GraphicUtils, IGraphicElement, Point} from "dahongpao-core";
import {OolongNodeManager} from "@/app/OolongNodeManager.ts";
import {DocState} from "@/app/DocState.ts";

export class OolongEventContext implements EventContext {
    nodeManager: OolongNodeManager;
    gmlRender: GMLRender;
    detectors: Map<OolongDetectorEnum, AbsDetector<any>>;
    toolManager: ToolManager;
    inputManager: InputManager;
    pageManager: PageManager;
    imageManager:ImageManager;
    auxiliaryCtx: EventContext;
    actionManager:ActionManager;
    auxiliaryManager:AuxiliaryManager;
    lastInteractiveEvent: InteractiveEvent|null=null;
    lastDiffTypeEvent: InteractiveEvent|null=null;
    docState:DocState;

    cursorManager:CursorManager;

    constructor(nodeManager: OolongNodeManager,
                gmlRender: GMLRender,
                detectors: Map<OolongDetectorEnum, AbsDetector<any>>,
                toolManager: ToolManager,
                inputManager: InputManager,
                imageManager:ImageManager,
                pageManager: PageManager,
                auxiliaryCtx:EventContext,
                actionManager:ActionManager,
                auxiliaryManager:AuxiliaryManager,
                docState:DocState) {
        this.nodeManager = nodeManager;
        this.gmlRender = gmlRender;
        this.detectors = detectors;
        this.toolManager = toolManager;
        this.inputManager = inputManager;
        this.imageManager=imageManager;
        this.pageManager = pageManager;
        this.auxiliaryCtx=auxiliaryCtx;
        this.actionManager=actionManager;
        this.auxiliaryManager=auxiliaryManager;
        this.cursorManager=new CursorManager();
        this.docState=docState;
    }

    setCursor(cursor:string){
        this.cursorManager.setCursor(cursor);
    }

    getSelectNodes():Set<IGraphicElement>{
        return this.auxiliaryManager.selectManager.selectNodes;
    }

    setSelect(nodes:Set<CanvasGraphicNode>){
        this.auxiliaryManager.selectManager.set(nodes);
    }

    onPage(event:InteractiveEvent):boolean{
        return this.pageManager.onPage(event);
    }

    execAction(actionLog:IActionLog):void{
        this.actionManager.execAction(actionLog);
    }

    reset():void{
        this.actionManager.renderManager.addAuxiliaryDrawTask();
        // this.auxiliaryManager.clear();
    }

    inSelect(globalPoint:Point):boolean{
        if(this.auxiliaryManager.selectManager.selectNodes.size===0){
            return false;
        }
        const selectBounds=this.auxiliaryManager.selectManager.getSelectBounds();
        return GraphicUtils.rectContains2(globalPoint,selectBounds);
    }


    canBeEditText():boolean{
        if(this.auxiliaryManager.selectionManager.selectionList.length>0){
            return true;
        }
        if(this.inputManager.typeWriter){
            return true;
        }
        return false;
    }
}