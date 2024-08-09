import {ExecutorManager} from "@/action/executor/ExecutorManager.ts";
import {ExecutorContext} from "@/action/executor/ExecutorContext.ts";
import {ActionLogGroup} from "@/action/log/ActionLogGroup.ts";

export class UndoRedoManager {

    undoStack:ActionLogGroup[]=[];
    redoStack:ActionLogGroup[]=[];

    add(actionLogGroup:ActionLogGroup):void{
        const reverseGroup:ActionLogGroup=actionLogGroup.reverse();
        this.undoStack.push(reverseGroup);
        this.redoStack=[];
    }

    undo(executor: ExecutorManager,execCtx:ExecutorContext):ActionLogGroup|null{
        const actionGroup=this.undoStack.pop()||null;
        if(!actionGroup){
            return null;
        }
        for(const action of actionGroup.actionLogs){
            executor.exec(action,execCtx);
        }
        this.redoStack.push(actionGroup.reverse());
        return actionGroup;
    }

    redo(executor: ExecutorManager,execCtx:ExecutorContext):ActionLogGroup|null{
        const actionGroup=this.redoStack.pop()||null;
        if(!actionGroup){
            return null;
        }
        for(const action of actionGroup.actionLogs){
            executor.exec(action,execCtx);
        }
        this.undoStack.push(actionGroup.reverse());
        return actionGroup;
    }
    
}