import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {DeleteType, RemoveNodeLog} from "@/action/log/node/RemoveNodeLog";
import {OolongLineDO} from "@/file/OolongLineDO";

export class AddLineLog implements IActionLog {
    type: ActionType=ActionType.AddLine;
    reverseLog:RemoveNodeLog|null=null;
    nodeData:OolongLineDO;

    constructor(data:OolongLineDO) {
        this.nodeData=data;
    }
    reverse(): IActionLog {
        return new RemoveNodeLog(this.nodeData.id,DeleteType.Line);
    }
    clone(): IActionLog {
        return  new AddLineLog({...this.nodeData});
    }

}