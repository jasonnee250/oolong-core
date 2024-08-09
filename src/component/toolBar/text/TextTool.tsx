import {BaseTool} from "@/component/toolBar/BaseTool.tsx";
import TextIcon from '@/resource/icons/TextIcon.svg?react'
import {Tooltip} from "antd";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import store from "@/store/RootStore.ts";
import {updateTool} from "@/store/reducer/GlobalStateReducer.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";

interface IProp {
    oolongApp:OolongApp;
    isSelected: boolean
}

export const TextTool = ({oolongApp,isSelected}: IProp) => {

    const onClick=()=>{
        oolongApp.toolManager.setCurrentTool(ToolEnum.TEXT, OolongShapeType.PureText);
        store.dispatch(updateTool({tool: ToolEnum.TEXT, shapeType: OolongShapeType.PureText}));
    }

    return (
        <Tooltip title="文字" mouseEnterDelay={0.3} placement={"right"}>
            <div>
                <BaseTool selected={isSelected} onClick={onClick}>
                    <TextIcon style={{width:"24px",height:"24px"}}/>
                </BaseTool>
            </div>
        </Tooltip>
    )
}