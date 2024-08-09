import {ILineLayout, LineLayoutEnum} from "@/interact/default/connectLine/layout/ILineLayout";
import {TopLeftLayout} from "@/interact/default/connectLine/layout/TopLeftLayout";
import {ConnectorPoint, NodeSideEnum} from "@/graphics/ConnectorPoint";
import {GraphicNode, Point} from "dahongpao-core";
import {DefaultLayout} from "@/interact/default/connectLine/layout/DefaultLayout.ts";
import {TopTopLayout} from "@/interact/default/connectLine/layout/TopTopLayout.ts";
import {TopRightLayout} from "@/interact/default/connectLine/layout/TopRightLayout.ts";
import {TopBottomLayout} from "@/interact/default/connectLine/layout/TopBottomLayout.ts";
import {RightLeftLayout} from "@/interact/default/connectLine/layout/RightLeftLayout.ts";
import {RightTopLayout} from "@/interact/default/connectLine/layout/RightTopLayout.ts";
import {RightRightLayout} from "@/interact/default/connectLine/layout/RightRightLayout.ts";
import {RightBottomLayout} from "@/interact/default/connectLine/layout/RightBottomLayout.ts";
import {BottomLeftLayout} from "@/interact/default/connectLine/layout/BottomLeftLayout.ts";
import {BottomTopLayout} from "@/interact/default/connectLine/layout/BottomTopLayout.ts";
import {BottomRightLayout} from "@/interact/default/connectLine/layout/BottomRightLayout.ts";
import {BottomBottomLayout} from "@/interact/default/connectLine/layout/BottomBottomLayout.ts";
import {LeftLeftLayout} from "@/interact/default/connectLine/layout/LeftLeftLayout.ts";
import {LeftTopLayout} from "@/interact/default/connectLine/layout/LeftTopLayout.ts";
import {LeftRightLayout} from "@/interact/default/connectLine/layout/LeftRightLayout.ts";
import {LeftBottomLayout} from "@/interact/default/connectLine/layout/LeftBottomLayout.ts";

export class LineLayoutWorker {

    layoutMap:Map<LineLayoutEnum,ILineLayout>=new Map<LineLayoutEnum, ILineLayout>();

    static _instance:LineLayoutWorker|null=null;

    static getInstance():LineLayoutWorker{
        if(this._instance===null){
            this._instance=new LineLayoutWorker();
        }
        return this._instance;
    }

    constructor() {
        const layoutList:ILineLayout[]=[
            new TopLeftLayout(),
            new TopTopLayout(),
            new TopRightLayout(),
            new TopBottomLayout(),
            new RightLeftLayout(),
            new RightTopLayout(),
            new RightRightLayout(),
            new RightBottomLayout(),
            new BottomLeftLayout(),
            new BottomTopLayout(),
            new BottomRightLayout(),
            new BottomBottomLayout(),
            new LeftLeftLayout(),
            new LeftTopLayout(),
            new LeftRightLayout(),
            new LeftBottomLayout(),
            new DefaultLayout(),
        ]
        for(const layout of layoutList){
            this.layoutMap.set(layout.type,layout);
        }
    }

    layoutFreeEndPoint(start:ConnectorPoint,end:Point,startNode:GraphicNode):Point[]{
        let controlPoint;
        if(end.x>start.x){
            /** 右侧 */
            if(start.y>end.y && start.y-end.y>(end.x-start.x)){
                controlPoint=new ConnectorPoint(end,0.5,1,NodeSideEnum.BOTTOM);
            }else if(start.y<end.y && end.y-start.y>(end.x-start.x)){
                controlPoint=new ConnectorPoint(end,0.5,0,NodeSideEnum.TOP);
            }else{
                controlPoint=new ConnectorPoint(end,0,0.5,NodeSideEnum.LEFT);
            }
        }else{
            /** 左侧 */
            if(start.y>end.y && start.y-end.y>(start.x-end.x)){
                controlPoint=new ConnectorPoint(end,0.5,1,NodeSideEnum.BOTTOM);
            }else if(start.y<end.y && end.y-start.y>(start.x-end.x)){
                controlPoint=new ConnectorPoint(end,0.5,0,NodeSideEnum.TOP);
            }else{
                controlPoint=new ConnectorPoint(end,1,0.5,NodeSideEnum.RIGHT);
            }
        }
        const layout=this.selectLayout(start, controlPoint);
        return layout.layout(start, controlPoint,startNode);
    }

    layoutFreeStartPoint(start:Point,end:ConnectorPoint,endNode:GraphicNode):Point[]{
        let controlPoint;
        if(end.x>start.x){
            controlPoint=new ConnectorPoint(start,0,0.5,NodeSideEnum.RIGHT);
        }else{
            controlPoint=new ConnectorPoint(start,1,0.5,NodeSideEnum.LEFT);
        }
        const layout=this.selectLayout(controlPoint,end);
        return layout.layout(controlPoint,end,undefined,endNode);
    }

    layout(start:ConnectorPoint,end:ConnectorPoint,startNode:GraphicNode,endNode:GraphicNode):Point[]{
        const layout=this.selectLayout(start, end);
        return layout.layout(start, end,startNode,endNode);
    }

    selectLayout(start:ConnectorPoint,end:ConnectorPoint):ILineLayout{
        const layout=this._selectLayout(start, end);
        if(layout){
            return layout;
        }
        return this.layoutMap.get(LineLayoutEnum.Default)!;
    }

    _selectLayout(start:ConnectorPoint,end:ConnectorPoint):ILineLayout|undefined{
        if(start.nodeSide===NodeSideEnum.LEFT && end.nodeSide===NodeSideEnum.LEFT){
            return  this.layoutMap.get(LineLayoutEnum.LeftLeft);
        }
        if(start.nodeSide===NodeSideEnum.LEFT && end.nodeSide===NodeSideEnum.TOP){
            return  this.layoutMap.get(LineLayoutEnum.LeftTop);
        }
        if(start.nodeSide===NodeSideEnum.LEFT && end.nodeSide===NodeSideEnum.RIGHT){
            return  this.layoutMap.get(LineLayoutEnum.LeftRight);
        }
        if(start.nodeSide===NodeSideEnum.LEFT && end.nodeSide===NodeSideEnum.BOTTOM){
            return  this.layoutMap.get(LineLayoutEnum.LeftBottom);
        }

        if(start.nodeSide===NodeSideEnum.TOP && end.nodeSide===NodeSideEnum.LEFT){
            return  this.layoutMap.get(LineLayoutEnum.TopLeft);
        }
        if(start.nodeSide===NodeSideEnum.TOP && end.nodeSide===NodeSideEnum.TOP){
            return  this.layoutMap.get(LineLayoutEnum.TopTop);
        }
        if(start.nodeSide===NodeSideEnum.TOP && end.nodeSide===NodeSideEnum.RIGHT){
            return  this.layoutMap.get(LineLayoutEnum.TopRight);
        }
        if(start.nodeSide===NodeSideEnum.TOP && end.nodeSide===NodeSideEnum.BOTTOM){
            return  this.layoutMap.get(LineLayoutEnum.TopBottom);
        }

        if(start.nodeSide===NodeSideEnum.RIGHT && end.nodeSide===NodeSideEnum.LEFT){
            return  this.layoutMap.get(LineLayoutEnum.RightLeft);
        }
        if(start.nodeSide===NodeSideEnum.RIGHT && end.nodeSide===NodeSideEnum.TOP){
            return  this.layoutMap.get(LineLayoutEnum.RightTop);
        }
        if(start.nodeSide===NodeSideEnum.RIGHT && end.nodeSide===NodeSideEnum.RIGHT){
            return  this.layoutMap.get(LineLayoutEnum.RightRight);
        }
        if(start.nodeSide===NodeSideEnum.RIGHT && end.nodeSide===NodeSideEnum.BOTTOM){
            return  this.layoutMap.get(LineLayoutEnum.RightBottom);
        }

        if(start.nodeSide===NodeSideEnum.BOTTOM && end.nodeSide===NodeSideEnum.LEFT){
            return  this.layoutMap.get(LineLayoutEnum.BottomLeft);
        }
        if(start.nodeSide===NodeSideEnum.BOTTOM && end.nodeSide===NodeSideEnum.TOP){
            return  this.layoutMap.get(LineLayoutEnum.BottomTop);
        }
        if(start.nodeSide===NodeSideEnum.BOTTOM && end.nodeSide===NodeSideEnum.RIGHT){
            return  this.layoutMap.get(LineLayoutEnum.BottomRight);
        }
        if(start.nodeSide===NodeSideEnum.BOTTOM && end.nodeSide===NodeSideEnum.BOTTOM){
            return  this.layoutMap.get(LineLayoutEnum.BottomBottom);
        }
    }





}