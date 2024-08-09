import "@/component/toolMenu/index.css"
import {Popover} from "antd";
import {FillPanel} from "@/component/toolMenu/fillButton/FillPanel.tsx";
import {FillButtonUnit} from "@/component/toolMenu/fillButton/FillButtonUnit.tsx";
import {OolongApp} from "@/app/OolongApp.ts";
import {ButtonContainer} from "@/component/toolMenu/ButtonContainer.tsx";
import {fillColorConfig} from "@/component/toolMenu/fillButton/FillColorConfig.ts";

interface IProp {
    color: string;
    oolongApp:OolongApp;

}

export const FillButton = ({color,oolongApp}: IProp) => {

    const colorList = fillColorConfig;

    const fillPanel = <FillPanel colorList={colorList} oolongApp={oolongApp} currentColor={color}/>;

    return (
        <Popover placement={"top"}
                 content={fillPanel}
                 trigger="click"
        >
            <div>
                <ButtonContainer>
                    <FillButtonUnit color={color}/>
                </ButtonContainer>
            </div>
        </Popover>

    )
}