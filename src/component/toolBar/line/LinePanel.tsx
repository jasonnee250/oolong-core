import {ILineShapeIcon} from "@/component/toolBar/line/lineConfig.tsx";
import {BaseTool} from "@/component/toolBar/BaseTool.tsx";
import "./index.css"
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";

interface IProp{
    currentTool:ToolEnum;
    shapeType:OolongLineType|OolongShapeType;
    lineConfig: ILineShapeIcon[];
    click:any;
}
export const LinePanel =({shapeType,currentTool,click,lineConfig}:IProp)=>{

    const onClick=(lineType:OolongLineType)=>{
        if(click){
            click(lineType);
        }
    }

    const selected=(shape:OolongLineType)=>{
        if(currentTool!==ToolEnum.LINE){
            return false;
        }
        return shapeType===shape;
    }

    return (
        <div className="line-panel">
            {lineConfig.map(line=>
                <BaseTool selected={selected(line.shape)} onClick={()=>onClick(line.shape)}>
                    {line.icon}
                </BaseTool>)}
        </div>
    )

}