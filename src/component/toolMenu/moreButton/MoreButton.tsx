import MoreIcon from '@/resource/icons/moreIcon.svg?react'
import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import {Popover} from "antd";
import {ToolMorePanel} from "@/component/toolMenu/moreButton/ToolMorePanel.tsx";
import {OolongApp} from "@/app/OolongApp.ts";

interface IProps{
    oolongApp:OolongApp;
}
export const MoreButton = ({oolongApp}:IProps) => {

    const panel=<ToolMorePanel oolongApp={oolongApp}/>

    return (
        <Popover placement={"bottom"}
                 trigger={"click"}
                 content={panel}
        >
            <div>
                <ButtonContainer noneExpand={true}>
                    <MoreIcon/>
                </ButtonContainer>
            </div>
        </Popover>

    )
}