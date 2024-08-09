import {CanvasGraphicNode} from "dahongpao-canvas";
import {OolongNodeDO} from "@/file/OolongNodeDO";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {IDrawer} from "@/graphics/IDrawer.ts";
import {EllipseDrawer} from "@/graphics/drawer/EllipseDrawer.ts";
import {RectDrawer} from "@/graphics/drawer/RectDrawer.ts";
import {TriangleDrawer} from "@/graphics/drawer/TriangleDrawer.ts";
import {OolongText} from "@/text/base/OolongText.ts";
import {
    AffineMatrix,
    GraphicUtils,
    LineDashType,
    Point,
    RectNode,
    TextAlignType,
    RectPoint
} from "dahongpao-core";
import {PageManager} from "@/page/PageManager.ts";
import {NodeTextPadding} from "@/text/config/OolongTextConstants.ts";
import {ConnectorPoint, NodeSideEnum} from "@/graphics/ConnectorPoint.ts";
import {BabianxingDrawer} from "@/graphics/drawer/BabianxingDrawer.ts";
import {DoubleArrowDrawer} from "@/graphics/drawer/DoubleArrowDrawer.ts";
import {LeftArrowDrawer} from "@/graphics/drawer/LeftArrowDrawer.ts";
import {LiubianxingDrawer} from "@/graphics/drawer/LiubianxingDrawer.ts";
import {LiuchengDrawer} from "@/graphics/drawer/LiuchengDrawer.ts";
import {Liucheng2Drawer} from "@/graphics/drawer/Liucheng2Drawer.ts";
import {PingxingsibianxingDrawer} from "@/graphics/drawer/PingxingsibianxingDrawer.ts";
import {QipaoDrawer} from "@/graphics/drawer/QipaoDrawer.ts";
import {PureTextDrawer} from "@/graphics/drawer/PureTextDrawer.ts";
import {Rect} from "@/text/base/Rect.ts";
import {RightArrowDrawer} from "@/graphics/drawer/RightArrowDrawer.ts";
import {TixingDrawer} from "@/graphics/drawer/TixingDrawer.ts";
import {WubianxingDrawer} from "@/graphics/drawer/WubianxingDrawer.ts";
import {WujiaoxingDrawer} from "@/graphics/drawer/WujiaoxingDrawer.ts";
import {YuduoDrawer} from "@/graphics/drawer/YuduoDrawer.ts";
import {LeftKuohaoDrawer} from "@/graphics/drawer/LeftKuohaoDrawer.ts";
import {LingxingDrawer} from "@/graphics/drawer/LingxingDrawer.ts";
import {Qipao2Drawer} from "@/graphics/drawer/Qipao2Drawer.ts";
import {RightKuohaoDrawer} from "@/graphics/drawer/RightKuohaoDrawer.ts";
import {RoundRectDrawer} from "@/graphics/drawer/RoundRectDrawer.ts";
import {RoundRect2Drawer} from "@/graphics/drawer/RoundRect2Drawer.ts";
import {ShiziDrawer} from "@/graphics/drawer/ShiziDrawer.ts";
import {Triangle2Drawer} from "@/graphics/drawer/Triangle2Drawer.ts";
import {YuanzhuDrawer} from "@/graphics/drawer/YuanzhuDrawer.ts";

export class OolongNode extends CanvasGraphicNode{

    type:string=OolongNodeType.Shape;
    shapeType:OolongShapeType=OolongShapeType.Rect;

    transform:AffineMatrix=AffineMatrix.generateMatrix();

    static drawerMap:Map<OolongShapeType,IDrawer>=new Map<OolongShapeType, IDrawer>([
        [OolongShapeType.PureText,new PureTextDrawer()],
        [OolongShapeType.Ellipse,new EllipseDrawer()],
        [OolongShapeType.Rect,new RectDrawer()],
        [OolongShapeType.Triangle,new TriangleDrawer()],
        [OolongShapeType.Triangle2,new Triangle2Drawer()],
        [OolongShapeType.Babianxing,new BabianxingDrawer()],
        [OolongShapeType.DoubleArrow,new DoubleArrowDrawer()],
        [OolongShapeType.LeftArrow,new LeftArrowDrawer()],
        [OolongShapeType.LiuBianXing,new LiubianxingDrawer()],
        [OolongShapeType.LiuCheng,new LiuchengDrawer()],
        [OolongShapeType.LiuCheng2,new Liucheng2Drawer()],
        [OolongShapeType.PingXingsiBianXing,new PingxingsibianxingDrawer()],
        [OolongShapeType.Qipao,new QipaoDrawer()],
        [OolongShapeType.RightArrow,new RightArrowDrawer()],
        [OolongShapeType.Tixing,new TixingDrawer()],
        [OolongShapeType.Triangle2,new Triangle2Drawer()],
        [OolongShapeType.Wubianxing,new WubianxingDrawer()],
        [OolongShapeType.WuJiaoxing,new WujiaoxingDrawer()],
        [OolongShapeType.Yunduo,new YuduoDrawer()],
        [OolongShapeType.LeftKuohao,new LeftKuohaoDrawer()],
        [OolongShapeType.Lingxing,new LingxingDrawer()],
        [OolongShapeType.Qipao2,new Qipao2Drawer()],
        [OolongShapeType.RightKuohao,new RightKuohaoDrawer()],
        [OolongShapeType.RoundRect,new RoundRectDrawer()],
        [OolongShapeType.RoundRect2,new RoundRect2Drawer()],
        [OolongShapeType.Shizi,new ShiziDrawer()],
        [OolongShapeType.YuanZhu,new YuanzhuDrawer()],
    ]);

    oolongText:OolongText|null=null;

    constructor(id: string, ctx: CanvasRenderingContext2D,hasText:boolean=true) {
        super(id,ctx);
        if(hasText){
            this.oolongText=new OolongText(id+"-text",ctx,
                new Point(this.x+NodeTextPadding,this.y+NodeTextPadding),null);
            this.oolongText.limitWidth=this.w-2*NodeTextPadding;
            this.oolongText.horizonAlign=TextAlignType.CENTER;
            this.oolongText.toNodeId=id;
        }
    }

    getRectNode(): RectNode {
        if(Math.abs(this.angle)<0.1){
            return {
                id: this.id,
                minX: this.x - this.borderWidth-13,
                minY: this.y - this.borderWidth-13,
                maxX: this.x + this.w + 2 * this.borderWidth+26,
                maxY: this.y + this.h + 2 * this.borderWidth+26,
            };
        }
        const rectNode:RectNode={
            id: this.id,
            minX: this.x - this.borderWidth-13,
            minY: this.y - this.borderWidth-13,
            maxX: this.x + this.w + 2 * this.borderWidth+26,
            maxY: this.y + this.h + 2 * this.borderWidth+26,
        };
        const points=[
            new Point(rectNode.minX,rectNode.minY),
            new Point(rectNode.maxX,rectNode.minY),
            new Point(rectNode.maxX,rectNode.maxY),
            new Point(rectNode.minX,rectNode.maxY),
        ];
        const modifyPoints:Point[]=[];
        for(const p of  points){
            modifyPoints.push(this.transform.crossPoint(p));
        }
        const rect=GraphicUtils.getBoundsByPoints(modifyPoints);
        rect.id=this.id;
        return rect;
    }

    getBounds(): RectNode {
        if(Math.abs(this.angle)<0.1){
            return {
                id: this.id,
                minX: this.x,
                minY: this.y,
                maxX: this.x + this.w,
                maxY: this.y + this.h,
            };
        }
        const rectNode:RectNode={
            id: this.id,
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.w,
            maxY: this.y + this.h,
        };
        const points=[
            new Point(rectNode.minX,rectNode.minY),
            new Point(rectNode.maxX,rectNode.minY),
            new Point(rectNode.maxX,rectNode.maxY),
            new Point(rectNode.minX,rectNode.maxY),
        ];
        const modifyPoints:Point[]=[];
        for(const p of  points){
            modifyPoints.push(this.transform.crossPoint(p));
        }
        const rect=GraphicUtils.getBoundsByPoints(modifyPoints);
        rect.id=this.id;
        return rect;
    }

    contains(point:Point){
        const localPoint=this.toLocalPoint(point);
        return localPoint.x>-0.5*this.w && localPoint.x<0.5*this.w
            && localPoint.y>-0.5*this.h && localPoint.y<0.5*this.h;
    }

    getRectPoint():RectPoint {
        const rectNode:RectNode={
            id: this.id,
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.w,
            maxY: this.y + this.h,
        };
        const points=[
            new Point(rectNode.minX,rectNode.minY),
            new Point(rectNode.maxX,rectNode.minY),
            new Point(rectNode.maxX,rectNode.maxY),
            new Point(rectNode.minX,rectNode.maxY),
        ]

        const modifyPoints:Point[]=[];
        for(const p of  points){
            modifyPoints.push(this.transform.crossPoint(p));
        }
        return {
            topLeft:modifyPoints[0],
            topRight:modifyPoints[1],
            bottomRight:modifyPoints[2],
            bottomLeft:modifyPoints[3],
        };
    }

    updateTransformMatrix():void{
        const center=new Point(this.x+0.5*this.w,this.y+0.5*this.h);
        const Trans1=AffineMatrix.generateMatrix().translate(-center.x,-center.y);
        const Rotate=AffineMatrix.generateMatrix().rotate(this.angle);
        const Trans2=AffineMatrix.generateMatrix().translate(center.x,center.y);
        this.transform=Trans2.crossProduct(Rotate.crossProduct(Trans1));
    }

    computeTextPos():Point|null{
        if(!this.oolongText){
            return null;
        }
        const textContentRect=this.getTextContentRect();
        const textRectNode=Rect.rectNode2Rect(this.oolongText.getRectNode());
        const verticalAlign=this.verticalAlign;
        let newTextPosY=0;
        if(verticalAlign===TextAlignType.TOP_OR_LEFT){
            newTextPosY=textContentRect.y;
        }else if(verticalAlign===TextAlignType.CENTER){
            newTextPosY=textContentRect.y+0.5*(textContentRect.height-textRectNode.height);
        }else if(verticalAlign===TextAlignType.BOTTOM_OR_RIGHT){
            newTextPosY=textContentRect.y+(textContentRect.height-textRectNode.height);
        }else{
            newTextPosY=textContentRect.y;
        }
        if(newTextPosY<textContentRect.y){
            newTextPosY=textContentRect.y;
        }
        return new Point(textContentRect.x,newTextPosY);
    }

    getPos(posX:number,posY:number):Point{
        return new Point(this.x+posX*this.w,this.y+posY*this.h);
    }

    updateConnectorPoint(cp:ConnectorPoint):void{
        const cache = this.toGlobalPoint(this.getPos(cp.xPos, cp.yPos));
        cp.x = cache.x;
        cp.y = cache.y
    }

    getConnectPoint():ConnectorPoint[]{
        const delta=13;
        const points:ConnectorPoint[]=[];
        {
            const point=GraphicUtils.leftPoint(this);
            point.x=point.x-delta;
            points.push(new ConnectorPoint(this.transform.crossPoint(point),0,0.5,NodeSideEnum.LEFT));
        }
        {
            const point=GraphicUtils.topPoint(this);
            point.y=point.y-delta;
            points.push(new ConnectorPoint(this.transform.crossPoint(point),0.5,0,NodeSideEnum.TOP));
        }
        {
            const point=GraphicUtils.rightPoint(this);
            point.x=point.x+delta;
            points.push(new ConnectorPoint(this.transform.crossPoint(point),1,0.5,NodeSideEnum.RIGHT));
        }
        {
            const point=GraphicUtils.bottomPoint(this);
            point.y=point.y+delta;
            points.push(new ConnectorPoint(this.transform.crossPoint(point),0.5,1,NodeSideEnum.BOTTOM));
        }
        return points;
    }

    toGlobalPoint(localPoint:Point):Point{
        return this.transform.crossPoint(localPoint);
    }

    /**
     * 返回相对坐标，以节点中心为坐标系原点；
     * @param globalPoint
     */
    toLocalPoint(globalPoint:Point):Point{
        const center=new Point(this.x+0.5*this.w,this.y+0.5*this.h);
        const T=AffineMatrix.generateMatrix().translate(-center.x,-center.y);
        const R=AffineMatrix.generateMatrix().rotate(-this.angle);

        const matrix=R.crossProduct(T);
        return matrix.crossPoint(globalPoint);
    }

    drawOnGLCtx(ctx:CanvasRenderingContext2D):void{
        const type=this.shapeType;
        let drawer=OolongNode.drawerMap.get(type);
        if(!drawer){
            console.error("取不到drawer，使用rect兜底!");
            drawer=OolongNode.drawerMap.get(OolongShapeType.Rect);
        }
        ctx.save();

        //设置旋转
        if(Math.abs(this.angle)>0.1){
            const center=new Point(this.x+0.5*this.w,this.y+0.5*this.h);
            const Trans1=AffineMatrix.generateMatrix().translate(-center.x,-center.y);
            const Rotate=AffineMatrix.generateMatrix().rotate(this.angle);
            const Trans2=AffineMatrix.generateMatrix().translate(center.x,center.y);
            const M=Trans2.crossProduct(Rotate.crossProduct(Trans1));
            const {a,b,c,d,e,f}=M;
            ctx.transform(a,b,c,d,e,f);
        }

        drawer!.draw(this,ctx);
        //todo 耗时操作，需要做进一步精细化判断
        if(this.oolongText && this.oolongText.hasText()){
            const textContentRect=this.getTextContentRect();
            ctx.save();
            ctx.beginPath();
            ctx.rect(textContentRect.x,textContentRect.y,
                textContentRect.width,textContentRect.height);
            ctx.clip();
            ctx.beginPath();
            this.oolongText.drawVisible(this.getRectNode(),ctx);
            ctx.restore();
        }
        ctx.restore();
    }

    getStretchMinSize():Point{
        return new Point(20,20);
    }

    draw() {
        this.drawOnGLCtx(this.graphicContext);
    }

    getTextContentRect():Rect{
        const type=this.shapeType;
        let drawer=OolongNode.drawerMap.get(type);
        if(!drawer){
            console.error("取不到drawer，使用rect兜底!");
            drawer=OolongNode.drawerMap.get(OolongShapeType.Rect);
        }
        return drawer!.textContentBounds(this);
    }

    serializeTo():OolongNodeDO{
        return {
            type: this.type,
            shapeType:this.shapeType,
            zIndex: this.zIndex,
            id:this.id,
            x:this.x,
            y:this.y,
            h:this.h,
            w:this.w,
            angle:this.angle,
            alpha:this.alpha,
            color:this.color,
            fontColor:this.fontColor,
            fontSize:this.fontSize,
            fontFamily:this.fontFamily,
            verticalAlign:this.verticalAlign,
            borderAlpha:this.borderAlpha,
            borderWidth:this.borderWidth,
            borderColor:this.borderColor,
            oolongText:this.oolongText?.serializeTo(),
            lineDashType:this.lineDashType,
        }
    }

    static load(nodeDO: OolongNodeDO, ctx: CanvasRenderingContext2D,pageManager:PageManager): OolongNode {
        const {oolongText,angle,verticalAlign,lineDashType,horizonAlign,type,shapeType,id, w,h,zIndex,color,alpha, fontColor,fontFamily, fontSize, x, y,borderAlpha,borderWidth,borderColor} = nodeDO;
        const node=new OolongNode(id,ctx);
        node.type=type;
        node.shapeType=shapeType===undefined?OolongShapeType.Rect:shapeType;
        node.zIndex=zIndex;
        node.color=color;
        node.alpha=alpha;
        node.fontColor=fontColor;
        node.fontFamily=fontFamily;
        node.fontSize=fontSize;
        node.x=x;
        node.y=y;
        node.w=w;
        node.h = h;
        node.angle=angle||0;
        if(verticalAlign!==undefined){
            node.verticalAlign=verticalAlign;
        }
        if(horizonAlign!==undefined){
            node.horizonAlign=horizonAlign;
        }
        if(borderWidth) {
            node.borderWidth = borderWidth;
        }
        if(borderAlpha){
            node.borderAlpha=borderAlpha;
        }
        if(borderColor){
            node.borderColor=borderColor;
        }
        if(oolongText){
            node.oolongText=OolongText.load(oolongText,ctx,pageManager);
        }
        if(node.oolongText){
            node.oolongText.toNodeId=node.id;
            if(horizonAlign!==undefined){
                node.oolongText.horizonAlign=horizonAlign;
            }
            node.oolongText.limitWidth=node.getTextContentRect().width;
        }
        node.lineDashType=lineDashType||LineDashType.None;
        node.updateTransformMatrix();
        return node;
    }

    }