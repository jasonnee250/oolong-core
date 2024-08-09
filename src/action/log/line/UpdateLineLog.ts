import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {OolongLineDO} from "@/file/OolongLineDO.ts";

export class UpdateLineLog implements IActionLog {
    type: ActionType=ActionType.UpdateLine;
    data:Partial<OolongLineDO>;
    reverseLog:UpdateLineLog|null=null;

    constructor(data:Partial<OolongLineDO>) {
        this.data=data;
    }
    reverse(): IActionLog {
        if(!this.reverseLog){
            throw new Error("数据错误！");
        }
        return this.reverseLog;
    }
    clone(): IActionLog {
        return new UpdateLineLog({...this.data});
    }

}