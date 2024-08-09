import {ActionType} from "@/action/base/ActionType";
import {IActionLog} from "@/action/log/IActionLog";

export class MoveNodeLog implements IActionLog {
    type: ActionType=ActionType.MoveNode;
    reverseLog:MoveNodeLog|null=null;

    id:string;

    dx:number;
    dy:number;

    constructor(id:string,dx:number,dy:number) {
        this.id=id;
        this.dy=dy;
        this.dx=dx;
    }
    reverse(): IActionLog {
        if(!this.reverseLog){
            throw new Error("数据错误！");
        }
        return this.reverseLog;    }
    clone(): IActionLog {
        return new MoveNodeLog(this.id,this.dx,this.dy)
    }

}