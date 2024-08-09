import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {RotateInfo} from "@/interact/detector/OolongRotateDetector.ts";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {AffineMatrix, GraphicUtils, Point} from "dahongpao-core";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {OolongLineDO} from "@/file/OolongLineDO.ts";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {OolongLinkLine} from "@/graphics/OolongLinkLine.ts";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType.ts";
import {RotateLine} from "@/auxiliary/graphics/RotateLine.ts";

interface RotateNodeProp{
    center:Point;
    angle:number;
    startPoint:Point;
    endPoint:Point;
}
export class RotateProcessor extends StreamProcessor {

    rotateInfo: RotateInfo | null = null;

    originPos: Point = new Point(0, 0);

    originAngle:number=0;
    relatedLinks: OolongLinkLine[] = [];

    rotateNodePropMap:Map<string,RotateNodeProp>=new Map();
    dragLength:number=0;

    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        const detector = ctx.detectors.get(OolongDetectorEnum.Rotate)!;
        this.rotateInfo = detector.result as RotateInfo;
        const globalPoint=InteractiveUtils.trimPoint(event.globalPoint);
        this.originPos=globalPoint;
        const rotateCenter=this.rotateInfo.rotateCenter;
        this.originAngle=InteractiveUtils.calculateAngle(rotateCenter,globalPoint);
        ctx.actionManager.execAction(new StartLog());

        ctx.auxiliaryManager.selectManager.hide=true;
        const selectNodes=ctx.getSelectNodes();
        for(const node of selectNodes){
            if(node instanceof OolongNode){
                this.rotateNodePropMap.set(node.id,{
                    center:new Point(node.x+0.5*node.w,node.y+0.5*node.h),
                    angle:node.angle,
                });
                this.relatedLinks.push(...ctx.nodeManager.getLinkLine(node.id));
            }else if(node instanceof OolongLine){
                const points=node.points;
                const startPoint=points[0];
                const endPoint=points[points.length-1];
                this.rotateNodePropMap.set(node.id,{
                    startPoint,
                    endPoint,
                })
            }

        }

        if(selectNodes.size===1){
            const node=[...selectNodes][0] as OolongNode;
            const w=0.5*node.w;
            const h=0.5*node.h;
            this.dragLength=Math.sqrt(w*w+h*h);
        }else{
            const selectBounds=ctx.auxiliaryManager.selectManager.getSelectBounds();
            const w=0.5*(selectBounds.maxX-selectBounds.minX);
            const h=0.5*(selectBounds.maxY-selectBounds.minY);
            this.dragLength=Math.sqrt(w*w+h*h);
        }
    }


    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        const globalPoint=InteractiveUtils.trimPoint(event.globalPoint);
        const rotateCenter=this.rotateInfo!.rotateCenter;
        const curAngle=InteractiveUtils.calculateAngle(rotateCenter,globalPoint);
        let deltaAngle=curAngle-this.originAngle;
        const selectNodes=ctx.getSelectNodes();
        //旋转吸附,按住ctrl，不开启吸附
        if(selectNodes.size===1 && !event.originEvent.ctrlKey){
            const selectNode=[...selectNodes][0];
            const rotateNodeProp=this.rotateNodePropMap.get(selectNode.id)!;
            const angle=rotateNodeProp.angle+deltaAngle;
            const normalizeAngle=InteractiveUtils.trimAngle(angle);
            const buffer=10;
            if(Math.abs(normalizeAngle)<buffer){
                deltaAngle+=(0-normalizeAngle);
            }
            if(Math.abs(normalizeAngle-90)<buffer){
                deltaAngle+=(90-normalizeAngle);
            }
            if(Math.abs(normalizeAngle-180)<buffer){
                deltaAngle+=(180-normalizeAngle);
            }
            if(Math.abs(normalizeAngle-270)<buffer){
                deltaAngle+=(270-normalizeAngle);
            }
            if(Math.abs(normalizeAngle-360)<buffer){
                deltaAngle+=(360-normalizeAngle);
            }
        }else if(!event.originEvent.ctrlKey){
            const normalizeAngle=InteractiveUtils.trimAngle(deltaAngle);
            const buffer=10;
            if(Math.abs(normalizeAngle)<buffer){
                deltaAngle+=(0-normalizeAngle);
            }
            if(Math.abs(normalizeAngle-90)<buffer){
                deltaAngle+=(90-normalizeAngle);
            }
            if(Math.abs(normalizeAngle-180)<buffer){
                deltaAngle+=(180-normalizeAngle);
            }
            if(Math.abs(normalizeAngle-270)<buffer){
                deltaAngle+=(270-normalizeAngle);
            }
            if(Math.abs(normalizeAngle-360)<buffer){
                deltaAngle+=(360-normalizeAngle);
            }
        }

        const Trans=AffineMatrix.generateMatrix().translate(-rotateCenter.x,-rotateCenter.y);
        const Rotate=AffineMatrix.generateMatrix().rotate(deltaAngle);
        const Trans2=AffineMatrix.generateMatrix().translate(rotateCenter.x,rotateCenter.y);
        const angleRadius=(this.originAngle+deltaAngle)*Math.PI/180;
        const dragPoint=new Point(this.rotateInfo!.rotateCenter.x+this.dragLength*Math.cos(angleRadius),
            this.rotateInfo!.rotateCenter.y+this.dragLength*Math.sin(angleRadius));

        const rotateLine=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.RotateLine) as RotateLine;
        // const dragPoint=
        rotateLine.updateProps(this.rotateInfo!.rotateCenter,dragPoint);
        ctx.auxiliaryManager.addRenderType(AuxiliaryType.RotateLine);

        const M=Trans2.crossProduct(Rotate.crossProduct(Trans));

        for(const node of selectNodes){
            const rotateNodeProp=this.rotateNodePropMap.get(node.id);
            if(!rotateNodeProp){
                continue;
            }
            if(node instanceof OolongNode){
                const pos=M.crossPoint(rotateNodeProp.center);
                const updateData: Partial<OolongNodeDO> = {
                    id: node.id,
                    x: pos.x-0.5*node.w,
                    y: pos.y-0.5*node.h,
                    angle:rotateNodeProp.angle+deltaAngle,
                }
                console.log("=====>:",updateData);
                ctx.actionManager.execAction(new UpdateNodeLog(updateData));
            }else if (node instanceof OolongLine){
                const linkInfo=ctx.nodeManager.oolongLinkMap.get(node.id);
                if(linkInfo && (linkInfo.start||linkInfo.end)){
                    continue;
                }
                const startPoint=rotateNodeProp.startPoint;
                const endPoint=rotateNodeProp.endPoint;
                const startPos=M.crossPoint(startPoint);
                const endPos=M.crossPoint(endPoint);
                let modifyPoints:Point[]=[];
                if(node.shapeType===OolongLineType.PolyLine){
                    modifyPoints=InteractiveUtils.layout(startPos,endPos);
                }else if(node.shapeType===OolongLineType.Curve){
                    modifyPoints=InteractiveUtils.curveLayout(startPos,endPos);
                }else{
                    modifyPoints=[startPos,endPos];
                }
                const updateData: Partial<OolongLineDO> = {
                    id: node.id,
                    points:modifyPoints,
                }
                ctx.actionManager.execAction(new UpdateLineLog(updateData));
            }
        }

        //更新
        for (const linkLine of this.relatedLinks) {
            const updateLog = InteractiveUtils.generateDrivenUpdateLineMsg(linkLine.id,ctx.nodeManager);
            if(updateLog){
                ctx.actionManager.execAction(updateLog);
            }
        }
    }

    onUp(event: InteractiveEvent, ctx: OolongEventContext): void {
        ctx.auxiliaryManager.selectManager.hide=false;
        ctx.actionManager.execAction(new EndLog());
        this.rotateInfo=null;
    }



}