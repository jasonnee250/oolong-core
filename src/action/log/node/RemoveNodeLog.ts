import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {AddLineLog} from "@/action/log/line/AddLineLog.ts";

export enum DeleteType{
    Line="Line",
    Node='Node',
}
export class RemoveNodeLog implements IActionLog {
    id:string;
    type: ActionType=ActionType.RemoveNode;
    deleteType:DeleteType=DeleteType.Node;
    addNodeLog:AddNodeLog|AddLineLog|null=null;

    constructor(id:string,deleteType:DeleteType=DeleteType.Node) {
        this.id=id;
        this.deleteType=deleteType;
    }
    reverse(): IActionLog {
        if(!this.addNodeLog){
            throw new Error("数据错误！");
        }
        return this.addNodeLog;
    }
    clone(): IActionLog {
        return new RemoveNodeLog(this.id);
    }

}