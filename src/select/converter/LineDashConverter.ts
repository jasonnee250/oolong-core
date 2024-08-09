import {IConverter} from "@/select/converter/IConverter";
import {IGraphicElement} from "dahongpao-core";
import {MIXED_PROP, SelectViewProps} from "@/select/view/SelectViewProps";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongNode} from "@/graphics/OolongNode";
import {OolongLine} from "@/graphics/OolongLine";

export class LineDashConverter implements IConverter{
    convert(selectNodes:IGraphicElement[],viewProps:SelectViewProps):void{
        let lineDash=undefined;
        for(const node of selectNodes){
            if(node.type === OolongNodeType.Shape
                ||node.type === OolongNodeType.SVG
                ||node.type === OolongNodeType.IMG
            ){
                if(lineDash===undefined){
                    lineDash=(node as OolongNode).lineDashType;
                }else{
                    const cur=(node as OolongNode).lineDashType;
                    if(lineDash!==cur){
                        viewProps.lineDashType=MIXED_PROP;
                        return;
                    }
                }
            }else if(node.type === OolongNodeType.Line){
                if(lineDash===undefined){
                    lineDash=(node as OolongLine).lineDashType
                }else{
                    const cur=(node as OolongLine).lineDashType;
                    if(lineDash!==cur){
                        viewProps.color=MIXED_PROP;
                        return;
                    }
                }
            }
        }
        viewProps.lineDashType=lineDash;
    }


}