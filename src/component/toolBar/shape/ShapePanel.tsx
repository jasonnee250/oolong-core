import "./index.css"
import {IShapeIcon} from "@/component/toolBar/shape/shapeConfig.tsx";
import {BaseTool} from "@/component/toolBar/BaseTool.tsx";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";

interface IProp{
    currentTool:ToolEnum;
    shapeType?:OolongLineType|OolongShapeType;
    shapeConfig:IShapeIcon[];
    className?:string;
    cLick?:any;
}
export const ShapePanel = ({shapeType,currentTool,cLick,className,shapeConfig}:IProp) => {

    const onClick=(shape:OolongShapeType,event:PointerEvent)=>{
        if(cLick){
            cLick(shape,event);
        }
    }

    const selected=(shape:OolongShapeType)=>{
        if(currentTool!==ToolEnum.SHAPE){
            return false;
        }
        return shapeType===shape;
    }

    const cln=()=>{
        if(className){
            return "shape-panel "+className;
        }
        return "shape-panel";
    }

    return (
        <div className={cln()}>
            {shapeConfig.map(shape=>(
                <BaseTool selected={selected(shape.shape)}
                          onClick={(event)=>onClick(shape.shape,event)}>
                    {shape.icon}
                </BaseTool>
            ))}
        </div>
    )
}