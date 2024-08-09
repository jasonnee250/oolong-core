import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";

export class SelectNodeLog implements IActionLog {
    type: ActionType=ActionType.SelectNode;
    data:string[];
    reverseLog:SelectNodeLog|null=null;

    constructor(ids:string[]) {
        this.data=ids;
    }

    reverse(): IActionLog {
        if(!this.reverseLog){
            throw new Error("数据错误！");
        }
        return this.reverseLog;
    }
    clone(): IActionLog {
        return new SelectNodeLog([...this.data]);
    }

}