import {PageDefine} from "@/component/rightTopTool/pageSetting/PageSettingConfig.ts";

/**
 * 页面对象
 */
export interface PageDO {

    id:string;
    x:number;
    y:number;
    w:number;
    h:number;
    borderAlpha:number;
    pageDefine:PageDefine;

}