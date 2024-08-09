import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import {Popover} from "antd";
import TextPropIcon from '@/resource/icons/TextColor.svg?react'
import {TextPanel} from "@/component/toolMenu/textButton/textColor/TextPanel.tsx";
import {OolongApp} from "@/app/OolongApp.ts";

interface IProps{
    oolongApp:OolongApp;
    currentTextColor:string;
    currentBgColor?:string;
}
export const TextColorButton = ({oolongApp,currentTextColor,currentBgColor}:IProps) => {

    const panel=<TextPanel oolongApp={oolongApp}
                           currentTextColor={currentTextColor}
                           currentBgColor={currentBgColor}
    />;

    return (
        <Popover placement={"top"}
                 content={panel}
                 trigger="click"
        >
            <div>
                <ButtonContainer>
                    <div className="text-button-container"
                        style={{color:currentTextColor,backgroundColor:currentBgColor}}>
                        <TextPropIcon/>
                    </div>
                </ButtonContainer>
            </div>
        </Popover>
    )
}