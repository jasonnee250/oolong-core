import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";

export class StartExecutor extends AbsActionExecutor {
    exec(_: IActionLog, _ctx: ExecutorContext): void {
        return;
    }
    type(): ActionType {
        return ActionType.Start;
    }

}