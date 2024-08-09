import {IConverter} from "@/select/converter/IConverter";
import {IGraphicElement} from "dahongpao-core";
import {MIXED_PROP, SelectViewProps} from "@/select/view/SelectViewProps";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongNode} from "@/graphics/OolongNode";
import {OolongLine} from "@/graphics/OolongLine";

export class BorderWidthConverter implements IConverter{
    convert(selectNodes:IGraphicElement[],viewProps:SelectViewProps):void{
        let borderWidth=undefined;

        for(const node of selectNodes){
            if(node.type === OolongNodeType.Shape
                ||node.type === OolongNodeType.SVG
                ||node.type === OolongNodeType.IMG
            ){
                if(borderWidth===undefined){
                    borderWidth=(node as OolongNode).borderWidth;
                }else{
                    const curColor=(node as OolongNode).borderWidth;
                    if(borderWidth!==curColor){
                        viewProps.color=MIXED_PROP;
                        return;
                    }
                }
            }else if(node.type === OolongNodeType.Line){
                if(borderWidth===undefined){
                    borderWidth=(node as OolongLine).width;
                }else{
                    const curColor=(node as OolongLine).width;
                    if(borderWidth!==curColor){
                        viewProps.color=MIXED_PROP;
                        return;
                    }
                }
            }
        }
        viewProps.borderWidth=borderWidth;
    }
}