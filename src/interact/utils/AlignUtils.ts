import {IGraphicElement, Point, RectNode} from "dahongpao-core";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {NodeManager} from "dahongpao-canvas";
import {
    AlignResult,
    AlignStretchResult,
    CacheAlignRes,
    StraightLine,
    StretchAlignRes
} from "@/interact/utils/AlignResult.ts";
import {Rect} from "@/text/base/Rect.ts";

export class AlignUtils {

    /** 移动对齐相关逻辑 */
    static alignTBHelper(rect1:RectNode,rect2:RectNode,isTop:boolean,p:Point,alignFn:any,moveRect:RectNode, rectNode: RectNode, viewBounds: RectNode, nodeManager: NodeManager, selectNodeSet: Set<IGraphicElement>, buffer: number = 2){
        let nodes = nodeManager.searchNodes(rect1.minX, rect1.minY, rect1.maxX, rect1.maxY);
        let hasAlign = false;
        let res:AlignResult|null = null;
        let cacheRes:CacheAlignRes|null=null;
        let alignLine = null;
        const points: Point[] = [];
        // const topLeft=new Point(moveRect.minX,moveRect.minY);
        for (const node of nodes) {
            if (selectNodeSet.has(node)) {
                continue;
            }
            if (!hasAlign) {
                cacheRes = alignFn(p, node.getBounds(), buffer);
                if (cacheRes) {
                    hasAlign = true;
                    const line=cacheRes.line;
                    alignLine=line;
                    points.push(line.start, line.end);
                    res={dx:cacheRes.dx,dy:cacheRes.dy,lines:[]};
                }
            } else {
                const bounds = node.getBounds();
                if (alignLine.start.y === bounds.minY) {
                    points.push(new Point(bounds.minX, bounds.minY));
                } else if (alignLine.start.y === bounds.maxY) {
                    points.push(new Point(bounds.minX, bounds.maxY));
                }
            }
        }
        points.sort((a, b) => a.x - b.x);
        //top 已经对齐，提前返回
        if (res) {
            res.lines.push({start: points[0], end: points[points.length - 1]});
            const endPoints: Point[] = []
            nodes = nodeManager.searchNodes(rect2.minX, rect2.minY, rect2.maxX, rect2.maxY);
            const c=isTop?1:-1;
            const y = alignLine.start.y + c*(rectNode.maxY - rectNode.minY);
            for (const node of nodes) {
                if (selectNodeSet.has(node)) {
                    continue;
                }
                const bounds = node.getBounds();
                if (y === bounds.minY) {
                    endPoints.push(new Point(bounds.minX, bounds.minY));
                } else if (y === bounds.maxY) {
                    endPoints.push(new Point(bounds.minX, bounds.maxY));
                }
            }
            if (endPoints.length !== 0) {
                endPoints.push(new Point(rectNode.minX, y));
                endPoints.sort((a, b) => a.x - b.x);
                res.lines.push({start: endPoints[0], end: endPoints[endPoints.length - 1]});
            }
            return res;
        }
    }

    static alignLRHelper(rect1:RectNode,rect2:RectNode,isLeft:boolean,p:Point,alignFn:any,moveRect:RectNode, rectNode: RectNode, viewBounds: RectNode, nodeManager: NodeManager, selectNodeSet: Set<IGraphicElement>, buffer: number = 2){
        let nodes = nodeManager.searchNodes(rect1.minX, rect1.minY, rect1.maxX, rect1.maxY);
        let hasAlign = false;
        let res:AlignResult|null = null;
        let cacheRes:CacheAlignRes|null=null;
        let alignLine = null;
        const points: Point[] = [];
        // const topLeft=new Point(moveRect.minX,moveRect.minY);
        for (const node of nodes) {
            if (selectNodeSet.has(node)) {
                continue;
            }
            if (!hasAlign) {
                cacheRes = alignFn(p, node.getBounds(), buffer);
                if (cacheRes) {
                    hasAlign = true;
                    const line=cacheRes.line;
                    alignLine=line;
                    points.push(line.start, line.end);
                    res={dx:cacheRes.dx,dy:cacheRes.dy,lines:[]};
                }
            } else {
                const bounds = node.getBounds();
                if (alignLine.start.x === bounds.minX) {
                    points.push(new Point(bounds.minX, bounds.minY));
                } else if (alignLine.start.x === bounds.maxX) {
                    points.push(new Point(bounds.maxX, bounds.minY));
                }
            }
        }
        points.sort((a, b) => a.y - b.y);
        //top 已经对齐，提前返回
        if (res) {
            res.lines.push({start: points[0], end: points[points.length - 1]});
            const endPoints: Point[] = []
            nodes = nodeManager.searchNodes(rect2.minX, rect2.minY, rect2.maxX, rect2.maxY);
            const c=isLeft?1:-1;
            const x = alignLine.start.x + c*(rectNode.maxX - rectNode.minX);
            for (const node of nodes) {
                if (selectNodeSet.has(node)) {
                    continue;
                }
                const bounds = node.getBounds();
                if (x === bounds.minX) {
                    endPoints.push(new Point(bounds.minX, bounds.minY));
                } else if (x === bounds.maxX) {
                    endPoints.push(new Point(bounds.maxX, bounds.minY));
                }
            }
            if (endPoints.length !== 0) {
                endPoints.push(new Point(x, rectNode.minY));
                endPoints.sort((a, b) => a.y - b.y);
                res.lines.push({start: endPoints[0], end: endPoints[endPoints.length - 1]});
            }
            return res;
        }
    }

    static alignLeftRight(moveRect:RectNode, rectNode: RectNode, viewBounds: RectNode, nodeManager: NodeManager, selectNodeSet: Set<IGraphicElement>, buffer: number = 2): AlignResult | null {
        const leftRect = {
            minX: rectNode.minX - buffer,
            maxX: rectNode.minX + buffer,
            minY: viewBounds.minY,
            maxY: viewBounds.maxY,
        };
        const rightRect = {
            minX: rectNode.maxX - buffer,
            maxX: rectNode.maxX + buffer,
            minY: viewBounds.minY,
            maxY: viewBounds.maxY,
        };
        const topLeft=new Point(moveRect.minX,moveRect.minY);
        let res:AlignResult|null =this.alignLRHelper(leftRect,rightRect,true,topLeft,AlignUtils.judgeAlignNodeLeft,moveRect,rectNode,viewBounds,nodeManager,selectNodeSet,buffer);
        if(res){
            return res;
        }
        res =this.alignLRHelper(leftRect,rightRect,true,topLeft,AlignUtils.judgeAlignNodeRight,moveRect,rectNode,viewBounds,nodeManager,selectNodeSet,buffer);
        if(res){
            return res;
        }
        const topRight=new Point(moveRect.maxX,moveRect.minY);

        res =this.alignLRHelper(rightRect,leftRect,false,topRight,AlignUtils.judgeAlignNodeLeft,moveRect,rectNode,viewBounds,nodeManager,selectNodeSet,buffer);
        if(res){
            return res;
        }
        res =this.alignLRHelper(rightRect,leftRect,false,topRight,AlignUtils.judgeAlignNodeRight,moveRect,rectNode,viewBounds,nodeManager,selectNodeSet,buffer);
        if(res){
            return res;
        }
        return null;
    }

    static alignTopBottom(moveRect:RectNode, rectNode: RectNode, viewBounds: RectNode, nodeManager: NodeManager, selectNodeSet: Set<IGraphicElement>, buffer: number = 2): AlignResult | null {
        const topRect = {
            minX: viewBounds.minX,
            maxX: viewBounds.maxX,
            minY: rectNode.minY - buffer,
            maxY: rectNode.minY + buffer
        };
        const bottomRect = {
            minX: viewBounds.minX,
            maxX: viewBounds.maxX,
            minY: rectNode.maxY - buffer,
            maxY: rectNode.maxY + buffer
        };
        const topLeft=new Point(moveRect.minX,moveRect.minY);
        let res:AlignResult|null =this.alignTBHelper(topRect,bottomRect,true,topLeft,AlignUtils.judgeAlignNodeTop,moveRect,rectNode,viewBounds,nodeManager,selectNodeSet,buffer);
        if(res){
            return res;
        }
        res =this.alignTBHelper(topRect,bottomRect,true,topLeft,AlignUtils.judgeAlignNodeBottom,moveRect,rectNode,viewBounds,nodeManager,selectNodeSet,buffer);
        if(res){
            return res;
        }
        const bottomLeft=new Point(moveRect.minX,moveRect.maxY);

        res =this.alignTBHelper(bottomRect,topRect,false,bottomLeft,AlignUtils.judgeAlignNodeTop,moveRect,rectNode,viewBounds,nodeManager,selectNodeSet,buffer);
        if(res){
            return res;
        }
        res =this.alignTBHelper(bottomRect,topRect,false,bottomLeft,AlignUtils.judgeAlignNodeBottom,moveRect,rectNode,viewBounds,nodeManager,selectNodeSet,buffer);
        if(res){
            return res;
        }
        return null;
    }

    static judgeAlignNodeTop(point: Point, node: RectNode, buffer: number = 2): CacheAlignRes | null {
        if (node.minY > point.y - buffer && node.minY < point.y + buffer) {
            const line: StraightLine = {start: new Point(point.x, node.minY), end: new Point(node.minX, node.minY)};
            return {
                dx: 0, dy: node.minY - point.y,
                line,
            };
        }
        return null;
    }

    static judgeAlignNodeBottom(point: Point, node: RectNode, res: AlignResult | null, buffer: number = 2): CacheAlignRes | null {
        if (node.maxY > point.y - buffer && node.maxY < point.y + buffer) {
            const line: StraightLine = {start: new Point(point.x, node.maxY), end: new Point(node.minX, node.maxY)};
            return {
                dx: 0, dy: node.maxY - point.y,
                line,
            };
        }
        return null;
    }

    static judgeAlignNodeLeft(point: Point, node: RectNode, res: AlignResult | null, buffer: number = 2): CacheAlignRes | null {
        if (node.minX > point.x - buffer && node.minX < point.x + buffer) {
            const line: StraightLine = {start: new Point(node.minX, point.y), end: new Point(node.minX, node.minY)};

            return {
                dx: node.minX - point.x,
                dy: 0,
                line,
            };

        }
        return null;
    }

    static judgeAlignNodeRight(point: Point, node: RectNode, res: AlignResult | null, buffer: number = 2): CacheAlignRes | null {
        if (node.maxX > point.x - buffer && node.maxX < point.x + buffer) {
            const line: StraightLine = {start: new Point(node.maxX, point.y), end: new Point(node.maxX, node.minY)};
            return {
                dx: node.maxX - point.x, dy: 0,
                line,
            };
        }
        return null;
    }

    /** 拉伸对齐相关逻辑 */
    static alignLR4Stretch(stretchRect:Rect,viewBounds:RectNode,selectNodeSet:Set<IGraphicElement>,nodeManager: NodeManager,buffer):AlignStretchResult|null{
        const searchNodes=nodeManager.searchNodes(viewBounds.minX,viewBounds.minY,viewBounds.maxX,viewBounds.maxY);
        const resList:StretchAlignRes[]=[];
        for(const node of searchNodes){
            if(selectNodeSet.has(node)){
                continue;
            }
            const rectNode=node.getBounds();
            if(Math.abs(rectNode.maxX-rectNode.minX-stretchRect.width)<buffer){
                resList.push({rectNode,isWidth:true});
                stretchRect.width=rectNode.maxX-rectNode.minX;
            }
        }
        if(resList.length===0){
            return null;
        }
        return {resList,stretchRect};
    }

    static alignTB4Stretch(stretchRect:Rect,viewBounds:RectNode,selectNodeSet:Set<IGraphicElement>,nodeManager: NodeManager,buffer):AlignStretchResult|null{
        const searchNodes=nodeManager.searchNodes(viewBounds.minX,viewBounds.minY,viewBounds.maxX,viewBounds.maxY);
        const resList:StretchAlignRes[]=[];
        for(const node of searchNodes){
            if(selectNodeSet.has(node)){
                continue;
            }
            const rectNode=node.getBounds();
            if(Math.abs(rectNode.maxY-rectNode.minY-stretchRect.height)<buffer){
                resList.push({rectNode,isWidth:false});
                stretchRect.height=rectNode.maxY-rectNode.minY;
            }
        }
        if(resList.length===0){
            return null;
        }
        return {resList,stretchRect};
    }
}