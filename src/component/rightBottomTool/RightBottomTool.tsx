import {BaseTool} from "@/component/toolBar/BaseTool";
import {Dropdown, Tooltip} from "antd";
import Undo from '@/resource/icons/undo/undo.svg?react'
import Redo from '@/resource/icons/undo/redo.svg?react'
import OutLineArrow from '@/resource/icons/undo/outlineArrow.svg?react'
import "./index.css"
import {scaleItemsConfig} from "@/component/rightBottomTool/scaleItemsConfig.tsx";
import {ToolSplitLine} from "@/component/rightBottomTool/ToolSplitLine.tsx";
import {OolongApp} from "@/app/OolongApp.ts";
import {useAppSelector} from "@/store/hooks.ts";
import {WheelUtils} from "@/plugin/WheelUtils.ts";

interface IProps{
    oolongApp:OolongApp;
}
export const RightBottomTool =({oolongApp}:IProps)=>{

    const clickScale=(scale:number)=>{
        oolongApp.application.gmlRender.scaleToCenter(scale);
        oolongApp.pageManager.pageApplication.gmlRender.scaleToCenter(scale);
        oolongApp.auxiliaryApplication.gmlRender.scaleToCenter(scale);
        WheelUtils.zoomRedraw(oolongApp.application.gmlRender,oolongApp.application.nodeManager);
        WheelUtils.zoomRedraw(oolongApp.pageManager.pageApplication.gmlRender,oolongApp.pageManager.pageApplication.nodeManager);
        WheelUtils.zoomRedraw(oolongApp.auxiliaryApplication.gmlRender,oolongApp.auxiliaryApplication.nodeManager);

    }

    const items = scaleItemsConfig(clickScale);

    const undo=()=>{
        oolongApp.actionManager.undo()
    }

    const redo=()=>{
        oolongApp.actionManager.redo()
    }

    const scale = useAppSelector((state) => state.globalState.scale);

    const showScale=Math.round(scale*100).toString()+"%";


    return (
        <div className='right-bottom-panel'>
            <Tooltip title="undo">
                <div>
                    <BaseTool selected={false} children={<Undo/>} onClick={undo}/>
                </div>
            </Tooltip>
            <Tooltip title="redo">
                <div>
                    <BaseTool selected={false} children={<Redo/>} onClick={redo}/>
                </div>
            </Tooltip>
            <ToolSplitLine/>
            <Dropdown trigger={["hover"]} menu={{items}} className='drop-down-list'>
                <div className='rb-drop-down'>
                    <p className="rb-scale">
                        {showScale}
                    </p>
                    <div className="rb-arrow">
                        <OutLineArrow/>
                    </div>
                </div>

            </Dropdown>

        </div>
    )

}