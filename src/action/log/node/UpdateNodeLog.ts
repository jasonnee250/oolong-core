import { ActionType } from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {OolongNodeDO} from "@/file/OolongNodeDO";

export class UpdateNodeLog implements IActionLog {
    type: ActionType=ActionType.UpdateNode;
    data:Partial<OolongNodeDO>;
    reverseLog:UpdateNodeLog|null=null;

    constructor(data:Partial<OolongNodeDO>) {
        this.data=data;
    }
    reverse(): IActionLog {
        if(!this.reverseLog){
            throw new Error("数据错误！");
        }
        return this.reverseLog;
    }
    clone(): IActionLog {
        return new UpdateNodeLog({...this.data});
    }

}