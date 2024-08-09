import {IActionLog} from "@/action/log/IActionLog";
import {ExecutorContext} from "@/action/executor/ExecutorContext";
import {ActionType} from "@/action/base/ActionType.ts";

export abstract class AbsActionExecutor {

    abstract exec(actionLog:IActionLog,ctx:ExecutorContext):void;

    abstract type():ActionType;

}