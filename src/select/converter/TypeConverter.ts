import {MIXED_PROP, SelectViewProps} from "@/select/view/SelectViewProps";
import {IGraphicElement} from "dahongpao-core";
import {IConverter} from "@/select/converter/IConverter";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {OolongNode} from "@/graphics/OolongNode";
import {OolongLine} from "@/graphics/OolongLine";

export class TypeConverter implements IConverter{

    convert(selectNodes:IGraphicElement[],viewProps:SelectViewProps):void{
        let nodeNum=0;
        let svgNum=0;
        let imgNum=0;
        let lineNum=0;
        const nodeSize=selectNodes.length;

        let shapeType=undefined;

        for(const node of selectNodes){
            if(node.type === OolongNodeType.Shape){
                nodeNum++;
                if(shapeType===undefined){
                    shapeType=(node as OolongNode).shapeType;
                }else{
                    const cur=(node as OolongNode).shapeType;
                    if(shapeType!==cur){
                        shapeType=MIXED_PROP;
                    }
                }
            }else if(node.type === OolongNodeType.Line){
                lineNum++;
                if(shapeType===undefined){
                    shapeType=(node as OolongNode).shapeType;
                }else{
                    const cur=(node as OolongNode).shapeType;
                    if(shapeType!==cur){
                        shapeType=MIXED_PROP;
                    }
                }
            }else if(node.type === OolongNodeType.SVG){
                svgNum++;
            }else if(node.type === OolongNodeType.IMG){
                imgNum++;
            }
        }
        if(nodeNum===nodeSize){
            viewProps.type=OolongNodeType.Shape;
            viewProps.shapeType=shapeType;
        }else if(lineNum===nodeSize){
            viewProps.type=OolongNodeType.Line;
            viewProps.shapeType=shapeType;
            viewProps.horizonAlign=undefined;
            viewProps.verticalAlign=undefined;
        }else if(svgNum===nodeSize){
            viewProps.type=OolongNodeType.SVG;
            viewProps.shapeType=undefined;
        }else if(imgNum===nodeSize){
            viewProps.type=OolongNodeType.IMG;
            viewProps.shapeType=undefined;
        }else{
            viewProps.type=undefined;
            viewProps.shapeType=undefined;
        }
    }

}