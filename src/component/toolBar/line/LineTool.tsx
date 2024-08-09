import {Popover} from "antd";
import {LinePanel} from "@/component/toolBar/line/LinePanel.tsx";
import {ToolEnum} from "@/tool/ToolEnum";
import LineIcon from '@/resource/icons/LineTool.svg?react'
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {BaseTool} from "@/component/toolBar/BaseTool.tsx";
import {OolongApp} from "@/app/OolongApp.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {lineConfig} from "@/component/toolBar/line/lineConfig.tsx";
import store from "@/store/RootStore.ts";
import {updateTool} from "@/store/reducer/GlobalStateReducer.ts";

interface IProp{
    oolongApp:OolongApp;
    currentTool:ToolEnum;
    currentShape:OolongLineType|OolongShapeType;
}
export const LineTool = ({currentTool,currentShape,oolongApp}:IProp) => {

    const showIcon=()=>{
        if(currentTool !==ToolEnum.LINE){
            return <LineIcon/>;
        }
        const res=lineConfig.filter(p=>p.shape===currentShape);
        return res[0].icon;
    }
    const lineIcon=showIcon();

    const click=(shape:OolongLineType)=>{
        oolongApp.toolManager.setCurrentTool(ToolEnum.LINE,shape);
        store.dispatch(updateTool({tool:ToolEnum.LINE,shapeType:shape}));
    }
    
    const panel=<LinePanel lineConfig={lineConfig} shapeType={currentShape} currentTool={currentTool} click={click}/>

    return (
        <Popover placement={"right"}
                 content={panel}
                 trigger="hover"
                 mouseEnterDelay={0.3}
        >
            <div>
                <BaseTool selected={currentTool===ToolEnum.LINE}>
                    {lineIcon}
                </BaseTool>
            </div>
        </Popover>
    )
}