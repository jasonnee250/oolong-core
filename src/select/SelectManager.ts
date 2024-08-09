import {CanvasGraphicNode} from "dahongpao-canvas";
import {GMLRender, GraphicUtils, IGraphicElement, RectNode} from "dahongpao-core";
import {SelectViewProps} from "@/select/view/SelectViewProps.ts";
import {InputManager} from "@/text/input/InputManager.ts";
import {ConverterCtx, IConverter} from "@/select/converter/IConverter.ts";
import {TypeConverter} from "@/select/converter/TypeConverter.ts";
import {ColorConverter} from "@/select/converter/ColorConverter.ts";
import {BorderColorConverter} from "@/select/converter/BorderColorConverter.ts";
import {BorderWidthConverter} from "@/select/converter/BorderWidthConverter.ts";
import {FontPropConverter} from "@/select/converter/FontPropConverter.ts";
import {LineDashConverter} from "@/select/converter/LineDashConverter.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OptionHelper} from "@/select/OptionHelper.ts";

export class SelectManager {

    selectNodes:Set<IGraphicElement>=new Set();

    gmlRender:GMLRender;
    inputManager:InputManager

    hide:boolean=false;

    viewConverters:IConverter[];

    optionHelper:OptionHelper;

    constructor(render:GMLRender,inputManager:InputManager) {
        this.gmlRender=render;
        this.inputManager=inputManager;
        this.viewConverters=[
            new ColorConverter(),
            new BorderColorConverter(),
            new BorderWidthConverter(),
            new LineDashConverter(),
            new FontPropConverter(),
            new TypeConverter(),
        ];
        this.optionHelper=new OptionHelper();
    }

    generateViewProps():SelectViewProps{
        const viewProps={} as SelectViewProps;
        if(this.selectNodes.size===0){
            return viewProps;
        }
        const selectList=[...this.selectNodes];
        const ctx:ConverterCtx={
            inputManager:this.inputManager,
        }
        for(const converter of this.viewConverters){
            converter.convert(selectList,viewProps,ctx);
        }
        return viewProps;
    }

    getSelectBounds():RectNode{
        const rectList:RectNode[]=[];
        for(const node of this.selectNodes){
            rectList.push(node.getBounds());
        }
        return GraphicUtils.getBounds(rectList,"selectBounds");
    }

    set(nodes:Set<IGraphicElement>){
        this.selectNodes=nodes;
        this.optionHelper.selectChange(nodes);
    }

    startOptWorking(idList:string[],x:number,y:number){
        this.optionHelper.startWorking(idList,x,y);
    }

    include(node:CanvasGraphicNode):boolean{
        return this.selectNodes.has(node);
    }

}