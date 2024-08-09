import {OolongLineDO} from "@/file/text/OolongLineDO.ts";
import {TextListInfo} from "@/text/base/TextListInfo.ts";
import {TextAlignType} from "dahongpao-core";

export interface OolongParagraphDO {

    index:number;
    fontSize:number;
    lines:OolongLineDO[];
    listInfo:TextListInfo;
    horizonAlign?:TextAlignType;

}