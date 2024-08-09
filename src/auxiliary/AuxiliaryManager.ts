import {GMLRender, GraphicUtils, IGraphicElement, Point, RectNode, RectPoint} from "dahongpao-core";
import {SelectionManager} from "@/text/selection/SelectionManager";
import {SelectManager} from "@/select/SelectManager";
import {MIXED_PROP, SelectViewProps} from "@/select/view/SelectViewProps.ts";
import store from "@/store/RootStore.ts";
import {setSelectProps} from "@/store/reducer/SelectPropStateReducer.ts";
import {InputManager} from "@/text/input/InputManager.ts";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType.ts";
import {HoverBound} from "@/auxiliary/graphics/HoverBound.ts";
import {HoverLine} from "@/auxiliary/graphics/HoverLine.ts";
import {SelectLine} from "@/auxiliary/graphics/SelectLine.ts";
import {Rect} from "@/text/base/Rect.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {MultiSelectBound} from "@/auxiliary/graphics/MultiSelectBound.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {TextSelection} from "@/auxiliary/graphics/TextSelection.ts";
import {SelectGroup} from "@/auxiliary/graphics/SelectGroup.ts";
import {MenuType, setToolMenu} from "@/store/reducer/ToolMenuStateReducer.ts";
import {HighlightRect} from "@/auxiliary/graphics/HighlightRect.ts";
import {HighlightLine, HighLightProps} from "@/auxiliary/graphics/HighlightLine.ts";
import {AlignLine} from "@/auxiliary/graphics/AlignLine.ts";
import {AlignStretchLine} from "@/auxiliary/graphics/AlignStretchLine.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {SingleSelectBound} from "@/auxiliary/graphics/SingleSelectBound.ts";
import {RotateLine} from "@/auxiliary/graphics/RotateLine.ts";

/**
 * 掌管辅助层重绘相关逻辑，为简化处理，辅助层重绘不使用脏区，使用全量渲染
 */
export class AuxiliaryManager {

    gmlRender: GMLRender;

    /**
     * 文字选区相关
     */
    selectionManager:SelectionManager;

    /**
     * 选中框相关重绘;
     */
    selectManager:SelectManager;

    graphicMap:Map<AuxiliaryType,IGraphicElement>;

    renderSet:Set<AuxiliaryType>;

    constructor(render: GMLRender,inputManager:InputManager) {
        this.gmlRender = render;
        this.selectionManager=new SelectionManager(render);
        this.selectManager=new SelectManager(render,inputManager);
        this.renderSet=new Set<AuxiliaryType>();
        this.graphicMap=new Map<AuxiliaryType, IGraphicElement>()
    }

    start():void{
        const ctx=this.gmlRender.canvas!.getContext("2d");
        const graphics=[
            new HoverLine(ctx),
            new HoverBound(ctx),
            new SelectLine(ctx),
            new MultiSelectBound(ctx),
            new TextSelection(ctx),
            new SelectGroup(ctx),
            new HighlightRect(ctx),
            new HighlightLine(ctx),
            new AlignLine(ctx),
            new AlignStretchLine(ctx),
            new SingleSelectBound(ctx),
            new RotateLine(ctx),
        ]
        for(const g of graphics){
            this.graphicMap.set(g.auxiliaryType,g);
        }
    }

    addRenderType(type:AuxiliaryType){
        this.renderSet.add(type);
    }

    clearTextSelection(){
        const needRedraw=this.selectionManager.selectionList.length>0;
        this.selectionManager.clear();
        if(needRedraw){
            this.redraw();
        }
    }

    redraw(){
        this.updateTextSelection();
        this.updateSelectGraphic();
        this.gmlRender.reset();
        for(const renderType of this.renderSet){
            const g=this.graphicMap.get(renderType);
            if(g){
                g.draw();
            }
        }
        this.renderSet.clear();
    }

    updateTextSelection(){
        if(this.selectionManager.selectionList.length===0){
            return;
        }
        const g=this.graphicMap.get(AuxiliaryType.TextSelection) as TextSelection;
        g.updateProps(this.selectionManager.selectionList);
        this.addRenderType(AuxiliaryType.TextSelection);
    }

    updateSelectGraphic(){
        if(this.selectManager.hide){
            return;
        }
        if(this.selectManager.selectNodes.size===0){
            return;
        }
        const selectNodes=this.selectManager.selectNodes;
        const rectList:RectPoint[]=[];
        if(selectNodes.size===1){
            const node=[...selectNodes][0];
            if(node instanceof OolongNode){
                const g=this.graphicMap.get(AuxiliaryType.SingleSelectBound) as SingleSelectBound;
                g.update(node.x,node.y,node.w,node.h,node.getConnectPoint(),node.transform);
                rectList.push(node.getRectPoint());
                this.addRenderType(AuxiliaryType.SingleSelectBound);
            }else if(node instanceof OolongLine){
                const g=this.graphicMap.get(AuxiliaryType.SelectLine) as SelectLine;
                g.updateProps(node.shapeType,node.points);
                this.addRenderType(AuxiliaryType.SelectLine);
            }
            const g=this.graphicMap.get(AuxiliaryType.SelectRect) as HighlightRect;
            g.updateProps(rectList);
            this.addRenderType(AuxiliaryType.SelectRect);
            return;
        }
        const rectNodes:RectNode[]=[];
        const highLightProps:HighLightProps[]=[]
        for(const node of selectNodes){
            if(node instanceof OolongNode){
                rectNodes.push(node.getBounds());
                rectList.push(node.getRectPoint());
            }else if(node instanceof OolongLine){
                rectNodes.push(node.getBounds());
                highLightProps.push({shapeType:node.shapeType,points:node.points});
            }
        }
        const selectRect=this.graphicMap.get(AuxiliaryType.SelectRect) as HighlightRect;
        selectRect.updateProps(rectList);
        this.addRenderType(AuxiliaryType.SelectRect);

        const highLine=this.graphicMap.get(AuxiliaryType.HighLightLine) as HighlightLine;
        highLine.updateProps(highLightProps);
        this.addRenderType(AuxiliaryType.HighLightLine);

        const rect=InteractiveUtils.rectNode2Rect(GraphicUtils.getBounds(rectNodes,"select_bounds"));
        const g=this.graphicMap.get(AuxiliaryType.MultiSelectBound) as MultiSelectBound;
        g.update(rect.x,rect.y,rect.width,rect.height);
        this.addRenderType(AuxiliaryType.MultiSelectBound);
    }

    generateViewProps():SelectViewProps|null{
        let viewProps:SelectViewProps|null=null;
        if(this.selectionManager.selectionList.length!==0){
            viewProps= this.selectionManager.generateViewProps();
        }
        if(this.selectManager.selectNodes.size!==0){
            const cache=this.selectManager.generateViewProps();
            viewProps={...viewProps,...cache};
        }
        return viewProps;
    }

    renderToolMenu():void{
        if(this.selectManager.hide){
            const toolInfo = store.getState().toolMenuState.info;
            if(toolInfo.menuType!==MenuType.None){
                store.dispatch(setToolMenu({x: 0, y: 0, menuType: MenuType.None}));
            }
            return;
        }
        if(this.selectManager.selectNodes.size===0){
            const toolInfo = store.getState().toolMenuState.info;
            if(toolInfo.menuType!==MenuType.None){
                store.dispatch(setToolMenu({x: 0, y: 0, menuType: MenuType.None}));
            }
            return;
        }
        const viewProps=this.generateViewProps();
        if(viewProps){
            store.dispatch(setSelectProps(viewProps));
        }
        const selectBound=this.selectManager.getSelectBounds();
        const globalPoint=new Point(selectBound.minX,selectBound.minY);
        const scale=0.5*this.gmlRender.getScale();
        let toolWidth=356;

        if(viewProps?.type===OolongNodeType.Shape){
            if(!viewProps.hasText){
                toolWidth=274;
            }else{
                toolWidth=415;
            }
        }else if(viewProps?.type===OolongNodeType.Line){
            if(!viewProps.hasText){
                toolWidth=215;
            }else{
                toolWidth=356;
            }
        }
        const posX=globalPoint.x+0.5*(selectBound.maxX-selectBound.minX-toolWidth/scale);
        const clientPoint=this.gmlRender.transformToLocal(new Point(posX,globalPoint.y));
        store.dispatch(setToolMenu({x:clientPoint.x,y:clientPoint.y-80,menuType:MenuType.ActionMenu}));
    }
}