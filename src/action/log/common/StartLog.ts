import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {EndLog} from "@/action/log/common/EndLog.ts";

export class StartLog implements IActionLog {
    type: ActionType=ActionType.Start;
    reverse(): IActionLog {
        return new EndLog();
    }
    clone(): IActionLog {
        return new StartLog();
    }

}
