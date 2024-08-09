import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {StartLog} from "@/action/log/common/StartLog.ts";

export class EndLog implements IActionLog {
    type: ActionType=ActionType.End;
    reverse(): IActionLog {
        return new StartLog()
    }
    clone(): IActionLog {
        return new EndLog();
    }

}
