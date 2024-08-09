import {ToolEnum} from "@/tool/ToolEnum";
import store from "@/store/RootStore.ts";
import {updateTool} from "@/store/reducer/GlobalStateReducer.ts";
import {NodeManager} from "dahongpao-canvas";
import {InputManager} from "@/text/input/InputManager.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";

export class ToolManager {

    nodeManager:NodeManager;
    inputManager:InputManager;
    currentTool:ToolEnum=ToolEnum.DEFAULT;
    shapeType:OolongShapeType|OolongLineType=OolongShapeType.Rect;

    constructor(nodeManager:NodeManager,inputManager:InputManager) {
        this.nodeManager=nodeManager;
        this.inputManager=inputManager;
    }
    setCurrentTool(tool:ToolEnum,shapeType:OolongShapeType|OolongLineType=OolongShapeType.Rect):void{
        this.currentTool=tool;
        this.shapeType=shapeType;
    }

    resetTool():void{
        this.currentTool=ToolEnum.DEFAULT;
        store.dispatch(updateTool({tool:ToolEnum.DEFAULT,shapeType:OolongShapeType.Rect}));
    }
}