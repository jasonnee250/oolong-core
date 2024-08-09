import "@/component/toolMenu/index.css"
import {Popover} from "antd";
import {OolongApp} from "@/app/OolongApp.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {ShapePanel} from "@/component/toolBar/shape/ShapePanel.tsx";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {changeShapeConfig} from "@/component/toolBar/shape/shapeConfig.tsx";
import {ButtonContainer} from "@/component/toolMenu/ButtonContainer.tsx";
import "./shapeButton.css"
import {MIXED_PROP} from "@/select/view/SelectViewProps.ts";
import Rect from '@/resource/shapes/base/rect.svg?react';
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

interface IProps{
    oolongApp:OolongApp;
    shapeType:OolongShapeType|MIXED_PROP;
}
export const ShapeButton = ({oolongApp,shapeType}:IProps) => {

    const click=(type:OolongShapeType)=>{
        const nodes=oolongApp.auxiliaryManager.selectManager.selectNodes;
        oolongApp.actionManager.execAction(new StartLog());
        for(const node of nodes){
            const updateData:Partial<OolongNodeDO>={
                id:node.id,
                shapeType:type,
            }
            const updateLog=new UpdateNodeLog(updateData);
            oolongApp.actionManager.execAction(updateLog);
        }
        oolongApp.actionManager.execAction(new EndLog());

    }
    const panel = <ShapePanel
        className={"shape-button-panel"}
        shapeConfig={changeShapeConfig}
        currentTool={ToolEnum.SHAPE}
        shapeType={shapeType}
        cLick={click}/>

    const showIcon = () => {
        if(shapeType===MIXED_PROP){
            return <Rect/>;
        }
        const res = changeShapeConfig.filter(p => p.shape === shapeType);
        return res[0].icon;
    }
    const shapeIcon = showIcon();


    return (
        <Popover placement={"top"}
                 content={panel}
                 trigger="click"
        >
            <div>
                <ButtonContainer>
                    {shapeIcon}
                </ButtonContainer>
            </div>
        </Popover>

    )
}