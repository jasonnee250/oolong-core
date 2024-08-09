import {IConverter} from "@/select/converter/IConverter";
import {IGraphicElement} from "dahongpao-core";
import {MIXED_PROP, SelectViewProps} from "@/select/view/SelectViewProps";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongNode} from "@/graphics/OolongNode";

export class ColorConverter implements IConverter{

    convert(selectNodes:IGraphicElement[],viewProps:SelectViewProps):void{
        let color=undefined;

        for(const node of selectNodes){
            if(node.type === OolongNodeType.Shape){
                if(color===undefined){
                    color=(node as OolongNode).color;
                }else{
                    const curColor=(node as OolongNode).color;
                    if(color!==curColor){
                        viewProps.color=MIXED_PROP;
                        return;
                    }
                }
            }
        }
        viewProps.color=color;
    }

}