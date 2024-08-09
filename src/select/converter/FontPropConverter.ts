import {ConverterCtx, IConverter} from "@/select/converter/IConverter";
import {IGraphicElement, TextAlignType} from "dahongpao-core";
import {MIXED_PROP, SelectViewProps} from "@/select/view/SelectViewProps";
import {OolongNode} from "@/graphics/OolongNode";
import {OolongLine} from "@/graphics/OolongLine";
import {TextListEnum} from "@/text/base/TextListInfo";
import {OolongText} from "@/text/base/OolongText";
import {OolongNodeType} from "@/graphics/OolongNodeType";

interface LastFontProps{
    fontSize?:number;
    italic?:boolean;
    bold?:boolean;
    fontColor?:string;
    horizonAlign?:TextAlignType;
    verticalAlign?:TextAlignType;
    hasText?:boolean;
    textListEnum?:TextListEnum;
    fontBackgroundColor?:string;
    underline?:boolean;
    strikeThrough?:boolean;
}
export class FontPropConverter implements IConverter{

    convert(selectNodes:IGraphicElement[],viewProps:SelectViewProps,ctx:ConverterCtx):void{

        const lastProps:LastFontProps={};
        for(const node of selectNodes){
            if(node instanceof OolongNode && node.type===OolongNodeType.Shape){
                const isEdit=ctx.inputManager.typeWriter?.oolongText.id===node.oolongText?.id;
                this.compare(lastProps,node,node.oolongText);
            }else if(node instanceof OolongLine && node.oolongText){
                const isEdit=ctx.inputManager.typeWriter?.oolongText.id===node.oolongText.id;
                this.compare(lastProps,node,node.oolongText);
            }
        }
        viewProps.fontSize=lastProps.fontSize;
        viewProps.italic=lastProps.italic;
        viewProps.bold=lastProps.bold;
        viewProps.fontColor=lastProps.fontColor;
        viewProps.horizonAlign=lastProps.horizonAlign;
        viewProps.verticalAlign=lastProps.verticalAlign;
        viewProps.hasText=lastProps.hasText;
        viewProps.textListEnum=lastProps.textListEnum;
        viewProps.fontBackgroundColor=lastProps.fontBackgroundColor;
        viewProps.underline=lastProps.underline;
        viewProps.strikeThrough=lastProps.strikeThrough;
    }


    compare(lastProps:LastFontProps,node:OolongNode|OolongLine,text:OolongText):void{
        if(lastProps.hasText===undefined){
            if(node.oolongText && node.oolongText.hasText()){
                lastProps.hasText=true;
            }else{
                lastProps.hasText=false;
            }
        }else if(!lastProps.hasText){
            if(node.oolongText && node.oolongText.hasText()){
                lastProps.hasText=true;
            }
        }
        /** font size */
        if(lastProps.fontSize===undefined){
            lastProps.fontSize=text.fontSize;
        }else if(lastProps.fontSize!==MIXED_PROP && lastProps.fontSize!==text.fontSize){
            lastProps.fontSize=MIXED_PROP;
        }
        /** font italic */
        if(lastProps.italic===undefined){
            lastProps.italic=text.italic;
        }else if(lastProps.italic!==MIXED_PROP && lastProps.italic!==text.italic){
            lastProps.italic=MIXED_PROP;
        }
        /** font bold */
        if(lastProps.bold===undefined){
            lastProps.bold=text.bold;
        }else if(lastProps.bold!==MIXED_PROP && lastProps.bold!==text.bold){
            lastProps.bold=MIXED_PROP;
        }
        /** font fontColor */
        if(lastProps.fontColor===undefined){
            lastProps.fontColor=text.fontColor;
        }else if(lastProps.fontColor!==MIXED_PROP && lastProps.fontColor!==text.fontColor){
            lastProps.fontColor=MIXED_PROP;
        }
        /** font horizonAlign */
        if(lastProps.horizonAlign===undefined){
            lastProps.horizonAlign=text.horizonAlign;
        }else if(lastProps.horizonAlign!==MIXED_PROP && lastProps.horizonAlign!==text.horizonAlign){
            lastProps.horizonAlign=MIXED_PROP;
        }
        /** font verticalAlign */
        if(node.type===OolongNodeType.Shape){
            if(lastProps.verticalAlign===undefined){
                lastProps.verticalAlign=(node as OolongNode).verticalAlign;
            }else if(lastProps.verticalAlign!==MIXED_PROP && lastProps.verticalAlign!==(node as OolongNode).verticalAlign){
                lastProps.verticalAlign=MIXED_PROP;
            }
        }
        /** font textListEnum */
        if(lastProps.textListEnum!==MIXED_PROP){
            const textListEnum=this.getTextListEnum(text);
            if(lastProps.textListEnum===undefined){
                lastProps.textListEnum=textListEnum;
            }else if(lastProps.textListEnum!==textListEnum){
                lastProps.textListEnum=MIXED_PROP;
            }
        }

        /** font underline */
        if(lastProps.underline===MIXED_PROP && lastProps.strikeThrough===MIXED_PROP && lastProps.fontBackgroundColor===MIXED_PROP){
            return;
        }
        const {underline,strikeThrough,fontBgColor}=this.getTextCharProps(text);
        if(lastProps.underline===undefined){
            lastProps.underline=underline;
        }else if(lastProps.underline!==MIXED_PROP && lastProps.underline!==underline){
            lastProps.underline=MIXED_PROP;
        }
        /** font strikeThrough */
        if(lastProps.strikeThrough===undefined){
            lastProps.strikeThrough=strikeThrough;
        }else if(lastProps.strikeThrough!==MIXED_PROP && lastProps.strikeThrough!==strikeThrough){
            lastProps.strikeThrough=MIXED_PROP;
        }
        /** font fontBackgroundColor */
        if(lastProps.fontBackgroundColor===undefined){
            lastProps.fontBackgroundColor=fontBgColor;
        }else if(lastProps.fontBackgroundColor!==MIXED_PROP && lastProps.fontBackgroundColor!==fontBgColor){
            lastProps.fontBackgroundColor=MIXED_PROP;
        }



    }

    getTextListEnum(oolongText:OolongText):TextListEnum|undefined{
        let textListEnum:TextListEnum|undefined=undefined;
        let ptr=oolongText.head.next;
        while (ptr && ptr.data){
            if(textListEnum===undefined){
                textListEnum=ptr.data.listInfo.listType;
            }else{
                if(textListEnum!==ptr.data.listInfo.listType){
                    textListEnum=TextListEnum.None;
                    break;
                }
            }
            ptr=ptr.next;
        }
        return textListEnum;
    }

    getTextCharProps(oolongText:OolongText){
        let fontBgColor:string|undefined=undefined;
        let underline:boolean|undefined=undefined;
        let strikeThrough:boolean|undefined=undefined;
        oolongText.traversalAll((char)=>{
            if(fontBgColor===undefined){
                fontBgColor=char.backgroundColor;
            }else if(fontBgColor!==char.backgroundColor){
                fontBgColor=undefined;
                if(underline===undefined && strikeThrough===undefined){
                    return true;
                }
            }

            if(underline===undefined){
                underline=char.underline;
            }else if(underline!==char.underline){
                underline=undefined;
                if(fontBgColor===undefined && strikeThrough===undefined){
                    return true;
                }
            }

            if(strikeThrough===undefined){
                strikeThrough=char.strikeThrough;
            }else if(strikeThrough!==char.strikeThrough){
                strikeThrough=undefined;
                if(underline===undefined && fontBgColor===undefined){
                    return true;
                }
            }
            return false;
        })
        return {underline,strikeThrough,fontBgColor};
    }


}