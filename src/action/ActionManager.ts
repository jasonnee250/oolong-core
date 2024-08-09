import {IActionLog} from "@/action/log/IActionLog";
import {ExecutorManager} from "@/action/executor/ExecutorManager";
import {UndoRedoManager} from "@/action/undo/UndoRedoManager";
import {actionExecutors} from "@/action/ActionConfig";
import {ExecutorContext} from "@/action/executor/ExecutorContext.ts";
import {InputManager} from "@/text/input/InputManager.ts";
import {PageManager} from "@/page/PageManager.ts";
import {NetworkManager} from "@/action/network/NetworkManager.ts";
import {GMLRender} from "dahongpao-core/dist/render/GMLRender";
import {ActionCache} from "@/action/cache/ActionCache.ts";
import {AuxiliaryManager} from "@/auxiliary/AuxiliaryManager.ts";
import {OolongNodeManager} from "@/app/OolongNodeManager.ts";
import {ImageManager} from "@/image/ImageManager.ts";
import {ToolManager} from "@/tool/ToolManager.ts";
import {RenderManager} from "@/action/render/RenderManager.ts";
import {DocState} from "@/app/DocState.ts";
import {ActionType} from "@/action/base/ActionType.ts";

const noneActionSet=new Set<ActionType>([
    ActionType.Start,
    ActionType.End,
    ActionType.SelectNode,
    ActionType.BlurText,
    ActionType.FocusText
])

export class ActionManager {
    /**
     * executor Ctx
     */
    execCtx: ExecutorContext;

    /**
     * 执行器
     */
    executor: ExecutorManager;
    /**
     * undo/redo 管理
     */
    undoManager: UndoRedoManager;
    /**
     * network 消息管理
     */
    networkManager: NetworkManager;
    /**
     * 消息缓存层
     */
    actionCache:ActionCache;

    renderManager:RenderManager;

    docState:DocState;


    constructor(nodeManager: OolongNodeManager,
                inputManager: InputManager,
                pageManager: PageManager,
                gmlRender:GMLRender,
                auxiliaryManager:AuxiliaryManager,
                imageManager:ImageManager,
                toolManager:ToolManager,
                docState:DocState,
    ) {
        this.executor = new ExecutorManager(actionExecutors);
        this.networkManager=new NetworkManager();
        this.undoManager = new UndoRedoManager();
        this.renderManager=new RenderManager(gmlRender,nodeManager,auxiliaryManager);
        this.execCtx = {
            pageManager,
            inputManager,
            nodeManager,
            gmlRender,
            auxiliaryManager,
            imageManager,
            toolManager,
            renderManager:this.renderManager,
        }
        this.actionCache=new ActionCache();
        this.docState=docState;

    }

    start():void{
        this.renderManager.start();
    }

    execAction(actionLog: IActionLog): void {
        this.dealDocSeq(actionLog);
        this.executor.exec(actionLog, this.execCtx);
        /** 添加一层缓存处理层 **/
        this.actionCache.add(actionLog);
        const actionGroup=this.actionCache.getActionGroup();
        if(!actionGroup){
            return;
        }
        this.undoManager.add(actionGroup);
        this.networkManager.enqueueGroup(actionGroup);
    }

    dealDocSeq(actionLog:IActionLog):void{
        if(noneActionSet.has(actionLog.type)){
            return;
        }
        this.docState.seq++;
    }

    undo(): void {
        const actionLogGroup = this.undoManager.undo(this.executor, this.execCtx);
        if (!actionLogGroup) {
            return;
        }
        this.networkManager.enqueueGroup(actionLogGroup);
    }

    redo(): void {
        const actionLogGroup = this.undoManager.redo(this.executor, this.execCtx);
        if (!actionLogGroup) {
            return;
        }
        this.networkManager.enqueueGroup(actionLogGroup);
    }


}