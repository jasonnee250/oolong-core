import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {Point} from "dahongpao-core";
import {StartLog} from "@/action/log/common/StartLog";
import {generateDefaultLineDO, OolongLineDO} from "@/file/OolongLineDO";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog";
import {EndLog} from "@/action/log/common/EndLog";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {ConnectPointRes} from "@/interact/detector/ConnectorPointDetector";
import {OolongLineType} from "@/graphics/OolongLineType";
import {OolongLine} from "@/graphics/OolongLine";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {IdGenerator} from "@/utils/IdGenerator";
import {AddLineLog} from "@/action/log/line/AddLineLog";
import {OolongLinkInfo} from "@/graphics/OolongLinkLine.ts";
import {AddLinkLog, LinkEndType} from "@/action/log/line/AddLinkLog.ts";
import {LineLayoutWorker} from "@/interact/default/connectLine/layout/LineLayoutWorker.ts";
import store from "@/store/RootStore.ts";
import {changeMenuType, MenuType, setToolMenu} from "@/store/reducer/ToolMenuStateReducer.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";

export class ConnectorLineProcessor extends StreamProcessor{

    res:ConnectPointRes|null=null;
    startPos: Point = new Point();
    shapeType:OolongLineType=OolongLineType.PolyLine;
    target: OolongLine | null = null;

    layoutWorker:LineLayoutWorker= LineLayoutWorker.getInstance();
    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        const detector=ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
        if(!detector||!detector.detect(event,ctx)){
            return;
        }
        const res=detector.result as ConnectPointRes;
        const connectPoint=res.connectorPoint;
        this.res=res;
        const start=this.res.node.getPos(connectPoint.xPos,connectPoint.yPos);
        this.startPos = start;
        const nodeId=IdGenerator.genId(OolongNodeType.Line);
        const nodeDO: OolongLineDO = generateDefaultLineDO(nodeId);
        nodeDO.type=OolongNodeType.Line;
        nodeDO.shapeType=this.shapeType;
        nodeDO.zIndex = IdGenerator.genZIndex();
        nodeDO.points=[
            this.startPos,
            new Point(event.globalPoint.x+1,event.globalPoint.y+1)
        ];
        ctx.actionManager.execAction(new StartLog());
        const addLog=new AddLineLog(nodeDO);
        ctx.actionManager.execAction(addLog);
        this.target=ctx.nodeManager.lineMap.get(nodeId)! as OolongLine;
        const linkInfo:OolongLinkInfo=new OolongLinkInfo(res.node.id,connectPoint);
        ctx.actionManager.execAction(new AddLinkLog(this.target!.id,LinkEndType.Start,linkInfo));
        ctx.actionManager.execAction(new SelectNodeLog([]));
        store.dispatch(setToolMenu({x:0,y:0,menuType:MenuType.None}));
        ctx.setCursor("move");
    }
    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        if(!this.res){
            return;
        }
        const points=this.layoutWorker.layoutFreeEndPoint(this.res.connectorPoint,event.globalPoint,this.res.node);

        const updateData={} as Partial<OolongLineDO>;
        updateData.id=this.target!.id;
        updateData.points=points;
        const updateLog=new UpdateLineLog(updateData);
        ctx.actionManager.execAction(updateLog);

    }
    onUp(event: InteractiveEvent, ctx: OolongEventContext): void {
        if(!this.res){
            return;
        }
        let showQuickMenu=false;
        const detector=ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
        if(detector && detector.detect(event,ctx)){
            const endRes=detector.result as ConnectPointRes;
            const points=this.layoutWorker.layout(this.res.connectorPoint,endRes.connectorPoint,this.res.node,endRes.node);
            const updateData={} as Partial<OolongLineDO>;
            updateData.id=this.target!.id;
            updateData.points=points;
            const updateLog=new UpdateLineLog(updateData);
            ctx.actionManager.execAction(updateLog);
            const linkInfo:OolongLinkInfo=new OolongLinkInfo(endRes.node.id,endRes.connectorPoint);
            ctx.actionManager.execAction(new AddLinkLog(this.target!.id,LinkEndType.End,linkInfo));
        }else{
            showQuickMenu=true;
        }
        ctx.actionManager.execAction(new SelectNodeLog([this.target!.id]));
        ctx.actionManager.execAction(new EndLog());
        this.res = null;
        ctx.toolManager.resetTool();
        const rect=this.target!.getRectNode();
        const clientPoint=ctx.gmlRender.transformToLocal(new Point(rect.minX,rect.minY-45));
        if(showQuickMenu){
            ctx.setCursor("default");
            store.dispatch(setToolMenu({x:event.clientPoint.x,y:event.clientPoint.y,menuType:MenuType.QuickMenu}));
        }else{
            ctx.auxiliaryManager.renderToolMenu();
        }
    }

}