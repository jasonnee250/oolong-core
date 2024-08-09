import {BasicPopPanel} from "@/component/popMenu/BasicPopPanel";
import {OolongApp} from "@/app/OolongApp.ts";
import {TextAlignType} from "dahongpao-core";
import {TextListEnum} from "@/text/base/TextListInfo.ts";

interface IProps{
    oolongApp:OolongApp;
    curFontSize?:number;
    curTextAlignType?:TextAlignType;
    curTextListEnum?:TextListEnum;
}
export const PopPanel=({oolongApp,curTextListEnum,curTextAlignType,curFontSize}:IProps)=>{

    return (
        <div>
            <BasicPopPanel oolongApp={oolongApp}
                           curFontSize={curFontSize}
                           curTextAlignType={curTextAlignType}
                           curTextListEnum={curTextListEnum}/>
        </div>
    )
}