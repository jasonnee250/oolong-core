import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {StretchInfo, StretchType} from "@/interact/detector/OolongStretchDetector";
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
import {OolongLine} from "@/graphics/OolongLine.ts";
import {Rect} from "@/text/base/Rect.ts";
import {OolongLineDO} from "@/file/OolongLineDO.ts";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog.ts";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType.ts";
import {AlignLine} from "@/auxiliary/graphics/AlignLine.ts";
import {AlignStretchLine} from "@/auxiliary/graphics/AlignStretchLine.ts";

interface StretchNodeProp{
    x:number,
    y:number,
    w:number,
    h:number,
    points:Point[],
}
export class StretchProcessor extends StreamProcessor {
    //拉伸开始记录点
    originPos: Point = new Point(0, 0);
    //最小拉伸尺寸
    minStretchSize: Point = new Point(0, 0);
    //上次拉伸生效点
    lastWorkSize:Point=new Point(0,0);
    target: StretchInfo | null = null;
    relatedLinks: OolongLinkLine[] = [];

    stretchNodePropMap:Map<string,StretchNodeProp>=new Map();

    onStart(event: InteractiveEvent, ctx: OolongEventContext): void {
        const detector = ctx.detectors.get(OolongDetectorEnum.Stretch)!;
        this.target = detector.result as StretchInfo;
        const xScale:number[]=[];
        const yScale:number[]=[];
        for(const node of this.target.nodes){
            if (node instanceof OolongNode) {
                this.relatedLinks.push(...ctx.nodeManager.getLinkLine(node.id));
                const minSize=node.getStretchMinSize();
                xScale.push(minSize.x/node.w);
                yScale.push(minSize.y/node.h);
                this.stretchNodePropMap.set(node.id,{x:node.x,y:node.y,w:node.w,h:node.h});
            }else if(node instanceof OolongLine){
                const minSize=node.getStretchMinSize();
                const nodeRect=node.getRectNode();
                xScale.push(minSize.x/(nodeRect.maxX-nodeRect.minX));
                yScale.push(minSize.y/(nodeRect.maxY-nodeRect.minY));
                this.stretchNodePropMap.set(node.id,{points:node.points});
            }
        }
        //计算拉伸最小尺寸点
        const minScaleX=Math.max(...xScale);
        const minScaleY=Math.max(...yScale);
        const minStretchWidth=(this.target.stretchBounds.maxX-this.target.stretchBounds.minX)*minScaleX;
        const minStretchHeight=(this.target.stretchBounds.maxY-this.target.stretchBounds.minY)*minScaleY;

        this.minStretchSize=new Point(minStretchWidth, minStretchHeight);

        this.originPos = InteractiveUtils.trimPoint(event.globalPoint);
        ctx.actionManager.execAction(new StartLog());
    }

    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        if (!this.target) {
            return;
        }
        const globalPoint = InteractiveUtils.trimPoint(event.globalPoint);
        const targetNode = Rect.rectNode2Rect(this.target.stretchBounds);

        const delta = new Point(globalPoint.x - this.originPos.x, globalPoint.y - this.originPos.y);
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
        const res=ctx.nodeManager.alignStretch(targetNode,ctx.gmlRender.getViewPortBounds(),ctx.getSelectNodes(),this.target.type,4/ctx.gmlRender.getScale());
        if(res){
            const alignLine=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.AlignStretchLine) as AlignStretchLine;
            alignLine.update(res.resList,2/ctx.gmlRender.getScale());
            ctx.auxiliaryManager.addRenderType(AuxiliaryType.AlignStretchLine);
        }
        //小于最小拉伸点时矫正拉伸点
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

        const currentCenter=new Point(targetNode.x+0.5*targetNode.width,targetNode.y+0.5*targetNode.height);
        const originCenter=new Point(0.5*(this.target.stretchBounds.minX+this.target.stretchBounds.maxX),
            0.5*(this.target.stretchBounds.minY+this.target.stretchBounds.maxY));
        const xScale=targetNode.width/(this.target.stretchBounds.maxX-this.target.stretchBounds.minX);
        const yScale=targetNode.height/(this.target.stretchBounds.maxY-this.target.stretchBounds.minY);


        const Trans=AffineMatrix.generateMatrix().translate(-originCenter.x,-originCenter.y);
        const Scale=AffineMatrix.generateMatrix().scale(xScale,yScale);
        const Trans2=AffineMatrix.generateMatrix().translate(currentCenter.x,currentCenter.y);
        const M=Trans2.crossProduct(Scale.crossProduct(Trans));

        for(const node of this.target.nodes){
            const stretchNodeProp=this.stretchNodePropMap.get(node.id);
            if(!stretchNodeProp){
                continue;
            }
            if(node instanceof OolongNode){
                const pos=M.crossPoint(new Point(stretchNodeProp.x,stretchNodeProp.y));
                const width=stretchNodeProp.w*xScale;
                const height=stretchNodeProp.h*yScale;

                //更新
                const updateData: Partial<OolongNodeDO> = {
                    id: node.id,
                    x: pos.x,
                    y: pos.y,
                    w: width,
                    h: height,
                }
                const updateLog = new UpdateNodeLog(updateData);
                ctx.actionManager.execAction(updateLog);
            }else if(node instanceof OolongLine){

                const linkInfo=ctx.nodeManager.oolongLinkMap.get(node.id);
                if(linkInfo && (linkInfo.start||linkInfo.end)){
                    continue;
                }

                const points:Point[]=[];
                for(const p of stretchNodeProp.points){
                    const pos=M.crossPoint(p);
                    points.push(pos);
                }
                const updateData: Partial<OolongLineDO> = {
                    id: node.id,
                    points,
                }
                const updateLog = new UpdateLineLog(updateData);
                ctx.actionManager.execAction(updateLog);
            }
        }
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
        for (const node of this.target!.nodes){
            if(node.type===OolongNodeType.SVG){
                const svgNode=node as OolongSVGNode;
                svgNode.generateTexture().then(p=>{
                    ctx.actionManager.renderManager.addDrawNode(p);
                });
            }
        }

        ctx.actionManager.execAction(new EndLog());
        this.target = null;
        this.relatedLinks=[];
        this.lastWorkSize.x = 0;
        this.lastWorkSize.y = 0;
        this.originPos.x = 0;
        this.originPos.y = 0;
        this.stretchNodePropMap.clear();
    }

}