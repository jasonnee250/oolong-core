import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "@/action/executor/ExecutorContext";
import {EditTextLog} from "@/action/log/text/EditDeleteTextLog";
import {ActionType} from "@/action/base/ActionType.ts";

export class EditTextExecutor extends AbsActionExecutor {
    exec(actionLog: EditTextLog,ctx:ExecutorContext): void {
        const typeWriter=ctx.inputManager.typeWriter;
        if(!typeWriter){
            console.error("没有文字处于编辑状态");
            return;
        }
        typeWriter.typeCharacterChars(actionLog,ctx.renderManager);
    }

    type(): ActionType {
        return ActionType.EditText;
    }

}