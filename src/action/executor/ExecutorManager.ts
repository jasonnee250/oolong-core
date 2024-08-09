import {IActionLog} from "@/action/log/IActionLog";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "@/action/executor/ExecutorContext";
import {ActionType} from "@/action/base/ActionType.ts";

export class ExecutorManager {

    executors:Map<ActionType,AbsActionExecutor>=new Map<ActionType, AbsActionExecutor>();

    constructor(executors:AbsActionExecutor[]) {
        for(const executor of executors){
            this.executors.set(executor.type(),executor);
        }
    }

    exec(actionLog:IActionLog,ctx:ExecutorContext):void{
        const executor=this.executors.get(actionLog.type);
        if(!executor){
            console.error("缺乏对应的消息处理器,已忽略该消息");
            return;
        }
        executor.exec(actionLog,ctx);
    }
}