import {IConverter} from "@/select/converter/IConverter";
import {IGraphicElement} from "dahongpao-core";
import {MIXED_PROP, SelectViewProps} from "@/select/view/SelectViewProps";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongNode} from "@/graphics/OolongNode";
import {OolongLine} from "@/graphics/OolongLine";

export class BorderColorConverter implements IConverter{
    convert(selectNodes:IGraphicElement[],viewProps:SelectViewProps):void{
        let color=undefined;
        for(const node of selectNodes){
            if(node.type === OolongNodeType.Shape
                ||node.type === OolongNodeType.SVG
                ||node.type === OolongNodeType.IMG
            ){
                if(color===undefined){
                    color=(node as OolongNode).borderColor;
                }else{
                    const curColor=(node as OolongNode).borderColor;
                    if(color!==curColor){
                        viewProps.borderColor=MIXED_PROP;
                        return;
                    }
                }
            }else if(node.type === OolongNodeType.Line){
                if(color===undefined){
                    color=(node as OolongLine).color;
                }else{
                    const curColor=(node as OolongLine).color;
                    if(color!==curColor){
                        viewProps.borderColor=MIXED_PROP;
                        return;
                    }
                }
            }
        }
        viewProps.borderColor=color;
    }


}