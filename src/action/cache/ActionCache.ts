import {IActionLog} from "@/action/log/IActionLog";
import {ActionLogGroup} from "@/action/log/ActionLogGroup";
import {ActionType} from "@/action/base/ActionType";

export class ActionCache {

    cacheLogs: IActionLog[]=[];
    duringGroup:boolean=false;


    add(actionLog:IActionLog):void{
        if(actionLog.type===ActionType.Start){
            this.duringGroup=true;
        }
        this.cacheLogs.push(actionLog);
        if(actionLog.type===ActionType.End){
            this.duringGroup=false;
        }
    }

    getActionGroup():ActionLogGroup|null{
        if(this.duringGroup){
           return null;
        }
        const group=new ActionLogGroup(this.cacheLogs);
        this.cacheLogs=[];
        return group;


    }





}