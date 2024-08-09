import {ActionType} from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog";
import {IGraphicElement} from "dahongpao-core";
import store from "@/store/RootStore.ts";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {updateTool} from "@/store/reducer/GlobalStateReducer.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";

/**
 * 注意！！！
 * view层相关,尤其是store.dispatch...不要放到executor内部
 */
export class SelectNodeExecutor extends AbsActionExecutor {
    exec(actionLog: SelectNodeLog, ctx: ExecutorContext): void {
        const ids=actionLog.data;
        const nodeSet=new Set<IGraphicElement>();
        const currentIds=[...ctx.auxiliaryManager.selectManager.selectNodes].map(p=>p.id);
        actionLog.reverseLog=new SelectNodeLog(currentIds);
        for(const id of ids){
            const node=ctx.nodeManager.nodeMap.get(id);
            if(node){
                nodeSet.add(node);
            }else{
                const line=ctx.nodeManager.lineMap.get(id);
                if(line){
                    nodeSet.add(line);
                }
            }
        }
        ctx.auxiliaryManager.selectManager.set(nodeSet);
        ctx.auxiliaryManager.clearTextSelection();
        if(ctx.toolManager.currentTool!==ToolEnum.DEFAULT){
            ctx.toolManager.setCurrentTool(ToolEnum.DEFAULT);
            store.dispatch(updateTool({tool:ToolEnum.DEFAULT,shapeType:OolongShapeType.Rect}));
        }
        ctx.renderManager.addAuxiliaryDrawTask();
    }
    type(): ActionType {
        return ActionType.SelectNode;
    }

}