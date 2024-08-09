import "@/component/toolMenu/index.css"
import {BorderPanel} from "@/component/toolMenu/borderButton/BorderPanel.tsx";
import {Popover} from "antd";
import {OolongApp} from "@/app/OolongApp.ts";
import {ButtonContainer} from "@/component/toolMenu/ButtonContainer.tsx";
import {BorderIcon} from "@/component/toolMenu/borderButton/BorderIcon.tsx";
import {borderColorConfig} from "@/component/toolMenu/borderButton/BorderColorConfig.ts";
import {LineDashType} from "dahongpao-core";

interface IProp{
    color:string;
    borderWidth:number;
    currentDashType?:LineDashType;
    oolongApp:OolongApp;
}
export const BorderButton = ({color,oolongApp,borderWidth,currentDashType}:IProp) => {

    const borderPanel=<BorderPanel
        colorList={borderColorConfig}
        oolongApp={oolongApp}
        currentColor={color}
        currentBorderWidth={borderWidth}
        currentDashType={currentDashType}
    />

    return (
        <Popover placement={"top"}
                 content={borderPanel}
                 trigger="click"
                 style={{paddingTop:"2px"}}
        >
            <div>
                <ButtonContainer>
                    <BorderIcon color={color}/>
                </ButtonContainer>
            </div>
        </Popover>
    )
}