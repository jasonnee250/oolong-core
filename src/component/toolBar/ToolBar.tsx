import {ToolEnum} from "@/tool/ToolEnum.ts";
import {useAppSelector} from "@/store/hooks.ts";
import {MouseEvent, useEffect, useMemo} from "react";
import store from "@/store/RootStore.ts";
import {updateTool} from "@/store/reducer/GlobalStateReducer.ts";
import {ImageTool} from "@/component/toolBar/img/ImageTool.tsx";
import {DragTopBarWorker} from "@/component/toolBar/DragTopBarWorker.ts";
import {LineTool} from "@/component/toolBar/line/LineTool.tsx";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {ShapeTool} from "@/component/toolBar/shape/ShapeTool.tsx";
import {TextTool} from "@/component/toolBar/text/TextTool.tsx";
import {OolongApp} from "@/app/OolongApp.ts";

export const ToolBarId="ToolBarId"

interface IProp{
    oolongApp:OolongApp;
}
export const ToolBar=({oolongApp}:IProp)=>{

    const currentTool = useAppSelector((state) => state.globalState.tool);
    const currentShapeType = useAppSelector((state) => state.globalState.shapeType);

    const setTool=(tool:ToolEnum,shape:OolongLineType|OolongShapeType=OolongShapeType.Rect)=>{
        oolongApp.toolManager.setCurrentTool(tool,shape);
        store.dispatch(updateTool({tool,shapeType:shape}));
    }
    const onClick=(e:MouseEvent)=>{
        e.stopPropagation();
    }

    const dragWorker=useMemo(()=>new DragTopBarWorker(),[]);

    const onDown=(event:any)=>{
        dragWorker.onDown(event)
    }

    const onMove=(event:any)=>{
        dragWorker.onMove(event)
    }
    const onUp=(_event:any)=>{
        dragWorker.onUp()
    }

    useEffect(() => {
        document.addEventListener("pointermove",onMove);
        document.addEventListener("pointerup",onUp);

        return ()=>{
            document.removeEventListener("pointermove",onMove);
            document.removeEventListener("pointerup",onUp);
        }
    }, []);

    return(
        <div className='tool-bar-container' id={ToolBarId}
             onClick={onClick}
             onPointerDown={onDown}
        >
            <TextTool isSelected={currentTool===ToolEnum.TEXT} oolongApp={oolongApp}/>
            <ShapeTool currentTool={currentTool} shapeType={currentShapeType} oolongApp={oolongApp}/>
            <LineTool currentTool={currentTool} currentShape={currentShapeType}  oolongApp={oolongApp}/>
            <ImageTool clickCb={setTool} oolongApp={oolongApp}/>
        </div>

    );
}