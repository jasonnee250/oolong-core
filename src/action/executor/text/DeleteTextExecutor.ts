import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {DeleteTextLog} from "@/action/log/text/EditDeleteTextLog";
import {ExecutorContext} from "@/action/executor/ExecutorContext";
import {ActionType} from "@/action/base/ActionType";

export class DeleteTextExecutor  extends AbsActionExecutor {
    exec(actionLog: DeleteTextLog,ctx:ExecutorContext): void {
        const typeWriter=ctx.inputManager.typeWriter;
        if(!typeWriter){
            console.error("没有文字处于编辑状态");
            return;
        }
        typeWriter.backSpaceLeft(actionLog,ctx.renderManager);
    }

    type(): ActionType {
        return ActionType.DeleteText;
    }

}