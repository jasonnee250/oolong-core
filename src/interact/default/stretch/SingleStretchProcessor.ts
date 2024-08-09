import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {StretchInfo} from "@/interact/detector/OolongStretchDetector";
import {AffineMatrix, Point} from "dahongpao-core";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import {OolongNodeDO} from "@/file/OolongNodeDO";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongSVGNode} from "@/graphics/OolongSVGNode.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {OolongLinkLine} from "@/graphics/OolongLinkLine.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {Rect} from "@/text/base/Rect.ts";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType.ts";
import {AlignStretchLine} from "@/auxiliary/graphics/AlignStretchLine.ts";
import {SingleStretchInfo, StretchType} from "@/interact/detector/OolongSingleStretchDetector.ts";

export class SingleStretchProcessor extends StreamProcessor {
    //拉伸开始记录点
    originPos: Point = new Point(0, 0);
    //最小拉伸尺寸
    minStretchSize: Point = new Point(0, 0);
    //上次拉伸生效点
    lastWorkSize:Point=new Point(0,0);
    target: SingleStretchInfo | null = null;
    relatedLinks: OolongLinkLine[] = [];

    stretchNodeRect:Rect=new Rect();

    originTransform:AffineMatrix=AffineMatrix.generateMatrix();


    getNodeLocalTransform(node:OolongNode){
        const center=new Point(node.x+0.5*node.w,node.y+0.5*node.h);
        const T=AffineMatrix.generateMatrix().translate(-center.x,-center.y);
        const R=AffineMatrix.generateMatrix().rotate(-node.angle);

        const matrix=R.crossProduct(T);
        return matrix;
    }


    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        const detector = ctx.detectors.get(OolongDetectorEnum.SingleStretch)!;
        this.target = detector.result as StretchInfo;
        const node=this.target!.node;
        this.relatedLinks.push(...ctx.nodeManager.getLinkLine(node.id));
        this.stretchNodeRect=new Rect(node.x,node.y,node.w,node.h);
        this.originTransform=this.getNodeLocalTransform(node);
        //计算拉伸最小尺寸点
        this.minStretchSize=node.getStretchMinSize();
        const globalPoint=InteractiveUtils.trimPoint(event.globalPoint);
        const localPoint=this.originTransform.crossPoint(globalPoint);
        this.originPos = localPoint;
        ctx.auxiliaryManager.selectManager.hide=true;
        ctx.actionManager.execAction(new StartLog());
    }

    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        if (!this.target) {
            return;
        }
        const node=this.target.node;
        const globalPoint = InteractiveUtils.trimPoint(event.globalPoint);
        const localPoint=this.originTransform.crossPoint(globalPoint);
        const targetNode = new Rect(this.stretchNodeRect.x,this.stretchNodeRect.y,this.stretchNodeRect.width,this.stretchNodeRect.height);

        const delta = new Point(localPoint.x - this.originPos.x, localPoint.y - this.originPos.y);
        //更新
        switch (this.target.type) {
            case StretchType.BOTTOM:
                targetNode.height += delta.y;
                break;
            case StretchType.LEFT:
                targetNode.x += delta.x;
                targetNode.width -= delta.x;
                break;
            case StretchType.RIGHT:
                targetNode.width += delta.x;
                break;
            case StretchType.TOP:
                targetNode.y += delta.y;
                targetNode.height -= delta.y;
                break;
            case StretchType.BOTTOM_LEFT:
                targetNode.height += delta.y;
                targetNode.x += delta.x;
                targetNode.width -= delta.x;
                break;
            case StretchType.BOTTOM_RIGHT:
                targetNode.height += delta.y;
                targetNode.width += delta.x;
                break;
            case StretchType.TOP_LEFT:
                targetNode.y += delta.y;
                targetNode.height -= delta.y;
                targetNode.x += delta.x;
                targetNode.width -= delta.x;
                break;
            case StretchType.TOP_RIGHT:
                targetNode.y += delta.y;
                targetNode.height -= delta.y;
                targetNode.width += delta.x;
                break;
            default:
                break;
        }
        //对齐设置
        const nodeAngle=InteractiveUtils.trimAngle(this.target.node.angle);
        if(Math.abs(nodeAngle)<1e-1){
            const res=ctx.nodeManager.alignStretch(targetNode,ctx.gmlRender.getViewPortBounds(),ctx.getSelectNodes(),this.target.type,4/ctx.gmlRender.getScale());
            if(res){
                const alignLine=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.AlignStretchLine) as AlignStretchLine;
                alignLine.update(res.resList,2/ctx.gmlRender.getScale());
                ctx.auxiliaryManager.addRenderType(AuxiliaryType.AlignStretchLine);
            }
        }

        // 小于最小拉伸点时矫正拉伸点
        if(targetNode.width<this.minStretchSize.x){
            const cache=this.minStretchSize.x-targetNode.width;
            targetNode.width=this.minStretchSize.x;
            if(this.target.type===StretchType.LEFT
                ||this.target.type===StretchType.TOP_LEFT
                ||this.target.type===StretchType.BOTTOM_LEFT
            ){
                targetNode.x=targetNode.x-cache;
            }
        }
        if(targetNode.height<this.minStretchSize.y){
            const cache=this.minStretchSize.y-targetNode.height;
            targetNode.height=this.minStretchSize.y;
            if(this.target.type===StretchType.TOP
                ||this.target.type===StretchType.TOP_LEFT
                ||this.target.type===StretchType.TOP_RIGHT
            ){
                targetNode.y=targetNode.y-cache;
            }
        }
        //看是否需要响应
        if(Math.abs(targetNode.width-this.lastWorkSize.x)<0.1 && Math.abs(targetNode.height-this.lastWorkSize.y)<0.1){
            return;
        }
        //斜向拉伸矫正
        if(Math.abs(nodeAngle)>1e-1){
            //top left不动点
            if(this.target.type===StretchType.RIGHT ||this.target.type===StretchType.BOTTOM||this.target.type===StretchType.BOTTOM_RIGHT){
                const leftTop=this.target.node.toGlobalPoint(new Point(this.target.node.x,this.target.node.y));
                const angle=this.target.node.angle;
                const radius=angle/180*Math.PI;
                const rightTop=new Point(leftTop.x+targetNode.width*Math.cos(radius),leftTop.y+targetNode.width*Math.sin(radius));
                const leftBottom=new Point(leftTop.x+targetNode.height*Math.cos(radius+0.5*Math.PI),leftTop.y+targetNode.height*Math.sin(radius+0.5*Math.PI));
                const center=new Point(0.5*(rightTop.x+leftBottom.x),0.5*(rightTop.y+leftBottom.y));
                targetNode.x=center.x-0.5*targetNode.width;
                targetNode.y=center.y-0.5*targetNode.height;
            }
            //bottom left不动点
            if(this.target.type===StretchType.TOP_RIGHT||this.target.type===StretchType.TOP){
                const bottomLeft=this.target.node.toGlobalPoint(new Point(this.target.node.x,this.target.node.y+this.target.node.h));
                const angle=this.target.node.angle;
                const radius=angle/180*Math.PI;
                const rightBottom=new Point(bottomLeft.x+targetNode.width*Math.cos(radius),bottomLeft.y+targetNode.width*Math.sin(radius));
                const leftTop=new Point(bottomLeft.x+targetNode.height*Math.cos(radius-0.5*Math.PI),bottomLeft.y+targetNode.height*Math.sin(radius-0.5*Math.PI));
                const center=new Point(0.5*(leftTop.x+rightBottom.x),0.5*(leftTop.y+rightBottom.y));
                targetNode.x=center.x-0.5*targetNode.width;
                targetNode.y=center.y-0.5*targetNode.height;
            }
            //top right不动点
            if(this.target.type===StretchType.LEFT ||this.target.type===StretchType.BOTTOM_LEFT){
                const topRight=this.target.node.toGlobalPoint(new Point(this.target.node.x+this.target.node.w,this.target.node.y));
                const angle=this.target.node.angle;
                const radius=angle/180*Math.PI;
                const rightBottom=new Point(topRight.x+targetNode.height*Math.cos(radius+0.5*Math.PI),topRight.y+targetNode.height*Math.sin(radius+0.5*Math.PI));
                const leftTop=new Point(topRight.x+targetNode.width*Math.cos(radius+Math.PI),topRight.y+targetNode.width*Math.sin(radius+Math.PI));
                const center=new Point(0.5*(leftTop.x+rightBottom.x),0.5*(leftTop.y+rightBottom.y));
                targetNode.x=center.x-0.5*targetNode.width;
                targetNode.y=center.y-0.5*targetNode.height;
            }
            //bottom right不动点
            if(this.target.type===StretchType.TOP_LEFT){
                const bottomRight=this.target.node.toGlobalPoint(new Point(this.target.node.x+this.target.node.w,this.target.node.y+this.target.node.h));
                const angle=this.target.node.angle;
                const radius=angle/180*Math.PI;
                const leftBottom=new Point(bottomRight.x+targetNode.width*Math.cos(radius+Math.PI),bottomRight.y+targetNode.width*Math.sin(radius+Math.PI));
                const topRight=new Point(bottomRight.x+targetNode.height*Math.cos(radius-0.5*Math.PI),bottomRight.y+targetNode.height*Math.sin(radius-0.5*Math.PI));
                const center=new Point(0.5*(leftBottom.x+topRight.x),0.5*(leftBottom.y+topRight.y));
                targetNode.x=center.x-0.5*targetNode.width;
                targetNode.y=center.y-0.5*targetNode.height;
            }
        }


        //更新
        const updateData: Partial<OolongNodeDO> = {
            id: node.id,
            x: targetNode.x,
            y: targetNode.y,
            w: targetNode.width,
            h: targetNode.height,
        }
        const updateLog = new UpdateNodeLog(updateData);
        ctx.actionManager.execAction(updateLog);

        this.lastWorkSize.x= targetNode.width;
        this.lastWorkSize.y= targetNode.height;
        //更新
        for (const linkLine of this.relatedLinks) {
            const updateLog = InteractiveUtils.generateDrivenUpdateLineMsg(linkLine.id,ctx.nodeManager);
            if(updateLog){
                ctx.actionManager.execAction(updateLog);
            }
        }
    }

    onUp(_event: InteractiveEvent, ctx: OolongEventContext): void {
        //svg重渲染
            if(this.target!.node.type===OolongNodeType.SVG){
                const svgNode=this.target!.node as OolongSVGNode;
                svgNode.generateTexture().then(p=>{
                    ctx.actionManager.renderManager.addDrawNode(p);
                });
            }
        ctx.auxiliaryManager.selectManager.hide=false;

        ctx.actionManager.execAction(new EndLog());
        this.target = null;
        this.relatedLinks=[];
        this.lastWorkSize.x = 0;
        this.lastWorkSize.y = 0;
        this.originPos.x = 0;
        this.originPos.y = 0;
    }

}