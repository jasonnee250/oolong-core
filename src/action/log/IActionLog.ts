import {ActionType} from "@/action/base/ActionType.ts";


export interface IActionLog {
    /**==========action数据描述区域==========*/
    type:ActionType;
    reverse():IActionLog;

    clone():IActionLog;

}