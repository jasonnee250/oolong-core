export enum TextListEnum{
    None="None",
    Ordered="Ordered",
    UnOrdered="UnOrdered",
}

export interface TextListInfo {
    /** 层级 */
    levelNum:number;
    /** 类型：有序or无序 */
    listType:TextListEnum;
    /** 有序列表的编号 */
    orderNum?:number;
}

export interface ParaListInfo{
    pIndex:number;
    listInfo:TextListInfo;
}

export function equalTextListInfo(a:TextListInfo,b:TextListInfo):boolean{
    if(a.listType!==b.listType){
        return false;
    }
    return true;
}