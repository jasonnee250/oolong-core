import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import {Popover} from "antd";
import TextPropIcon from '@/resource/icons/TextProp.svg?react'
import {TextPanel} from "@/component/toolMenu/textButton/textProp/TextPanel.tsx";
import {OolongApp} from "@/app/OolongApp.ts";
import {SelectViewProps} from "@/select/view/SelectViewProps.ts";

interface IProps{
    oolongApp:OolongApp;
    selectViewProps:SelectViewProps;
}
export const TextPropButton = ({oolongApp,selectViewProps}:IProps) => {

    const panel=<TextPanel oolongApp={oolongApp} selectViewProps={selectViewProps}/>;

    return (
        <Popover placement={"top"}
                 content={panel}
                 trigger="click"
        >
            <div>
                <ButtonContainer>
                    <TextPropIcon/>
                </ButtonContainer>
            </div>
        </Popover>
    )
}