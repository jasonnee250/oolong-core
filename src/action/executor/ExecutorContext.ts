import {InputManager} from "@/text/input/InputManager";
import {PageManager} from "@/page/PageManager";
import {GMLRender} from "dahongpao-core/dist/render/GMLRender";
import {AuxiliaryManager} from "@/auxiliary/AuxiliaryManager.ts";
import {OolongNodeManager} from "@/app/OolongNodeManager.ts";
import {ImageManager} from "@/image/ImageManager.ts";
import {ToolManager} from "@/tool/ToolManager.ts";
import {RenderManager} from "@/action/render/RenderManager.ts";

export interface ExecutorContext {

    nodeManager:OolongNodeManager;
    inputManager:InputManager;
    pageManager:PageManager;
    gmlRender:GMLRender;
    auxiliaryManager:AuxiliaryManager;
    imageManager:ImageManager;
    toolManager:ToolManager;
    renderManager:RenderManager;
}