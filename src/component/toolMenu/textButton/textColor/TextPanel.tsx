import {TextColorPanel} from "@/component/toolMenu/textButton/textColor/TextColorPanel";
import {HorizonSplitLine} from "@/component/toolMenu/HorizonSplitLine";
import {TextBgColorPanel} from "@/component/toolMenu/textButton/textColor/TextBgColorPanel";
import {ToolPanelTitle} from "@/component/toolMenu/ToolPanelTitle";
import {OolongApp} from "@/app/OolongApp.ts";

interface IProps{
    oolongApp:OolongApp;
    currentTextColor:string;
    currentBgColor?:string;
}
export const TextPanel = ({oolongApp,currentTextColor,currentBgColor}:IProps) => {



    return (
        <div className="text-color-container">
            <ToolPanelTitle title={"文字颜色"}/>
            <TextColorPanel oolongApp={oolongApp} currentTextColor={currentTextColor}/>
            <HorizonSplitLine/>
            <ToolPanelTitle title={"背景颜色"}/>
            <TextBgColorPanel currentBgColor={currentBgColor||"none"} oolongApp={oolongApp}/>
        </div>
    )
}