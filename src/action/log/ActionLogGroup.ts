import {IActionLog} from "@/action/log/IActionLog";

export class ActionLogGroup {
    actionLogs:IActionLog[]=[];

    constructor(logs:IActionLog[]=[]) {
        this.actionLogs=logs;
    }


    reverse():ActionLogGroup{
        const reverseGroup:ActionLogGroup=new ActionLogGroup();
        for(let i=this.actionLogs.length-1;i>-1;i--){
            const log=this.actionLogs[i];
            reverseGroup.actionLogs.push(log.reverse());
        }
        return reverseGroup;
    }
}