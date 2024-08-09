import {OolongCharDO} from "@/file/text/OolongCharDO";

export interface OolongLineDO {
    x:number;
    y:number;
    height: number;
    index:number;
    charList:OolongCharDO[];
    parent:string;
}