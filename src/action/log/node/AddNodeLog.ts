import { ActionType } from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {OolongNodeDO} from "@/file/OolongNodeDO";
import {RemoveNodeLog} from "@/action/log/node/RemoveNodeLog.ts";

export class AddNodeLog implements IActionLog {
    type: ActionType=ActionType.AddNode;
    nodeData:OolongNodeDO;
    deleteLog:RemoveNodeLog|null=null;

    constructor(data:OolongNodeDO) {
        this.nodeData=data;
    }
    reverse(): IActionLog {
        return new RemoveNodeLog(this.nodeData.id);
    }
    clone(): IActionLog {
        return new AddNodeLog({...this.nodeData});
    }

}