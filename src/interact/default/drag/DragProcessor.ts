import {IGraphicElement, Point, RectNode} from "dahongpao-core";
import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import store from "@/store/RootStore.ts";
import {MenuType, setToolMenu} from "@/store/reducer/ToolMenuStateReducer.ts";
import {MoveNodeLog} from "@/action/log/node/MoveNodeLog.ts";
import {OolongLinkLine} from "@/graphics/OolongLinkLine.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongLineDO} from "@/file/OolongLineDO.ts";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {IdGenerator} from "@/utils/IdGenerator.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {AddLineLog} from "@/action/log/line/AddLineLog.ts";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType.ts";
import {AlignLine} from "@/auxiliary/graphics/AlignLine.ts";

export class DragProcessor extends StreamProcessor {

    lastPos: Point = new Point(0, 0);
    lastMoveRect:RectNode|null=null;
    relatedLinks: OolongLinkLine[] = [];
    targetNodes: IGraphicElement[] = [];

    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        ctx.actionManager.execAction(new StartLog());
        const selectNodes=ctx.getSelectNodes();
        const idList:string[]=[];
        for(const p of selectNodes){
            let selectNode=p as OolongNode|OolongLine;
            if(event.originEvent.altKey){
                const oolongNodeDO=selectNode.serializeTo();
                const id=IdGenerator.genId(oolongNodeDO.type);
                oolongNodeDO.id=id;
                oolongNodeDO.zIndex=IdGenerator.genZIndex();
                if(oolongNodeDO.type===OolongNodeType.Line){
                    ctx.execAction(new AddLineLog(oolongNodeDO as OolongLineDO));
                    selectNode=ctx.nodeManager.lineMap.get(id) as OolongLine;
                }else{
                    ctx.execAction(new AddNodeLog(oolongNodeDO as OolongNodeDO));
                    selectNode=ctx.nodeManager.nodeMap.get(id) as OolongNode;
                }
                idList.push(id);
            }

            this.targetNodes.push(selectNode);
            if (selectNode instanceof OolongNode) {
                this.relatedLinks.push(...ctx.nodeManager.getLinkLine(selectNode.id));
            }
        }
        this.lastMoveRect=ctx.auxiliaryManager.selectManager.getSelectBounds();
        if(event.originEvent.altKey && idList.length!==0){
            ctx.execAction(new SelectNodeLog(idList));
            ctx.auxiliaryManager.selectManager.startOptWorking(idList,this.lastMoveRect.minX,this.lastMoveRect.minY);
        }


        this.lastPos = InteractiveUtils.trimPoint(event.globalPoint);

        ctx.auxiliaryManager.selectManager.hide = true;
        store.dispatch(setToolMenu({x: 0, y: 0, menuType: MenuType.None}));
    }

    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        if (this.targetNodes.length===0) {
            return;
        }
        const globalPoint = InteractiveUtils.trimPoint(event.globalPoint);
        const delta = new Point(globalPoint.x - this.lastPos.x, globalPoint.y - this.lastPos.y);
        this.moveRect(delta);

        const selectBounds=ctx.auxiliaryManager.selectManager.getSelectBounds();
        const viewBounds=ctx.gmlRender.getViewPortBounds();
        const selectNodes=ctx.getSelectNodes();
        const res=ctx.nodeManager.alignMove(this.lastMoveRect,selectBounds,viewBounds,selectNodes,2/ctx.gmlRender.getScale());
        if(res){
            this.moveRect({x:res.dx,y:res.dy});
            delta.x=this.lastMoveRect!.minX-selectBounds.minX;
            delta.y=this.lastMoveRect!.minY-selectBounds.minY;
            const alignLine=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.AlignLine) as AlignLine;
            alignLine.update(res.lines,2/ctx.gmlRender.getScale());
            ctx.auxiliaryManager.addRenderType(AuxiliaryType.AlignLine);
        }
        for(const node of this.targetNodes){
            ctx.actionManager.execAction(new MoveNodeLog(node.id, delta.x, delta.y));
            this.lastPos = globalPoint;
        }
        //更新
        for (const linkLine of this.relatedLinks) {
            const updateLog = InteractiveUtils.generateDrivenUpdateLineMsg(linkLine.id,ctx.nodeManager);
            if(updateLog){
                ctx.actionManager.execAction(updateLog);
            }
        }
    }

    onUp(_event: InteractiveEvent, ctx: OolongEventContext): void {
        ctx.auxiliaryManager.selectManager.hide = false;
        ctx.actionManager.execAction(new EndLog());
        ctx.actionManager.renderManager.addAuxiliaryDrawTask();
        this.targetNodes=[]
        this.relatedLinks = [];
        this.lastPos.x = 0;
        this.lastPos.y = 0;
        ctx.auxiliaryManager.renderToolMenu();
    }

    moveRect(delta:Point):void{
        if(this.lastMoveRect===null){
            return;
        }
        this.lastMoveRect.minX+=delta.x;
        this.lastMoveRect.maxX+=delta.x;
        this.lastMoveRect.minY+=delta.y;
        this.lastMoveRect.maxY+=delta.y;
    }

}