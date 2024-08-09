import {IGraphicElement} from "dahongpao-core";
import {SelectViewProps} from "@/select/view/SelectViewProps";
import {InputManager} from "@/text/input/InputManager";


export interface ConverterCtx{
    inputManager:InputManager;
}
export interface IConverter {
    convert(selectNodes:IGraphicElement[],viewProps:SelectViewProps,ctx:ConverterCtx):void;
}