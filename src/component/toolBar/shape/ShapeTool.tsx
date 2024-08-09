import ShapeIcon from '@/resource/icons/RectIcon.svg?react'
import {Popover} from "antd";
import {ShapePanel} from "@/component/toolBar/shape/ShapePanel";
import "../index.css"
import {BaseTool} from "@/component/toolBar/BaseTool.tsx";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {shapeConfig} from "@/component/toolBar/shape/shapeConfig.tsx";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import store from "@/store/RootStore.ts";
import {updateTool} from "@/store/reducer/GlobalStateReducer.ts";

interface IProp {
    currentTool: ToolEnum;
    shapeType: OolongShapeType | OolongLineType;
    oolongApp: OolongApp;
}

export const ShapeTool = ({currentTool, shapeType, oolongApp}: IProp) => {

    const showIcon = () => {
        if (currentTool !== ToolEnum.SHAPE) {
            return <ShapeIcon/>;
        }
        const res = shapeConfig.filter(p => p.shape === shapeType);
        return res[0].icon;
    }
    const shapeIcon = showIcon();

    const panelClick = (shape: OolongShapeType) => {
        oolongApp.toolManager.setCurrentTool(ToolEnum.SHAPE, shape);
        store.dispatch(updateTool({tool: ToolEnum.SHAPE, shapeType: shape}));
    }

    const panel = <ShapePanel
        shapeConfig={shapeConfig}
        currentTool={currentTool}
        shapeType={shapeType}
        cLick={panelClick}/>

    return (
        <Popover placement={"right"}
                 content={panel}
                 trigger="hover"
                 mouseEnterDelay={0.3}
        >
            <div>
                <BaseTool selected={currentTool===ToolEnum.SHAPE} children={shapeIcon}/>
            </div>
        </Popover>

    )
}