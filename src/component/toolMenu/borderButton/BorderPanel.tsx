import {OolongApp} from "@/app/OolongApp.ts";
import "./index.css"
import {BorderDashPanel} from "@/component/toolMenu/borderButton/BorderDashPanel.tsx";
import {BorderWithPanel} from "@/component/toolMenu/borderButton/BorderWithPanel.tsx";
import {BorderFillPanel} from "@/component/toolMenu/borderButton/BorderFillPanel.tsx";
import {SplitLine} from "@/component/common/SplitLine.tsx";
import {HorizonSplitLine} from "@/component/toolMenu/HorizonSplitLine.tsx";
import {ToolPanelTitle} from "@/component/toolMenu/ToolPanelTitle.tsx";
import {LineDashType} from "dahongpao-core";

interface IProp {
    currentColor: string;
    currentBorderWidth: number;
    currentDashType?:LineDashType;
    colorList: string[];
    oolongApp: OolongApp;
}

export const BorderPanel = ({oolongApp, currentColor, currentBorderWidth,currentDashType}: IProp) => {

    return (
        <div className="border-panel">
            <ToolPanelTitle title={"边框样式"}/>
            <div className="border-prop-panel">
                <BorderDashPanel oolongApp={oolongApp} currentDashType={currentDashType}/>
                <SplitLine/>
                <BorderWithPanel currentBorderWidth={currentBorderWidth} oolongApp={oolongApp}/>
            </div>
            <HorizonSplitLine/>
            <BorderFillPanel currentColor={currentColor} oolongApp={oolongApp}/>

        </div>
    )
}