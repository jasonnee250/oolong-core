import {NodeManager} from "dahongpao-canvas";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongText} from "@/text/base/OolongText.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongLinkLine} from "@/graphics/OolongLinkLine.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {Rect} from "@/text/base/Rect.ts";
import {IGraphicElement, RectNode} from "dahongpao-core";
import {AlignUtils} from "@/interact/utils/AlignUtils.ts";
import {StretchType} from "@/interact/detector/OolongStretchDetector.ts";
import {AlignStretchResult} from "@/interact/utils/AlignResult.ts";

export class OolongNodeManager extends NodeManager{

    oolongLinkMap:Map<string,OolongLinkLine>=new Map<string, OolongLinkLine>();
    nodeLinkMap=new Map<string, Set<string>>();//nodeId,links

    addUpdateLinkLineInfo(curLinkLine:OolongLinkLine){
        const prevLineLine=this.oolongLinkMap.get(curLinkLine.id);
        //node linkmap维护
        if(!prevLineLine){
            if(curLinkLine.start){
                this.addUpdateNodeLinkMap(curLinkLine.start.id,curLinkLine.id);
            }
            if(curLinkLine.end){
                this.addUpdateNodeLinkMap(curLinkLine.end.id,curLinkLine.id);
            }
        }else{
            if(prevLineLine.start && curLinkLine.start && prevLineLine.start.id!==curLinkLine.start.id){
                this.removeNodeLinkMap(prevLineLine.start.id,curLinkLine.id);
                this.addUpdateNodeLinkMap(curLinkLine.start.id,curLinkLine.id);
            }
            if(prevLineLine.end && curLinkLine.end && prevLineLine.end.id!==curLinkLine.end.id){
                this.removeNodeLinkMap(prevLineLine.end.id,curLinkLine.id);
                this.addUpdateNodeLinkMap(curLinkLine.end.id,curLinkLine.id);
            }
            if(curLinkLine.start){
                this.addUpdateNodeLinkMap(curLinkLine.start.id,curLinkLine.id);
            }
            if(curLinkLine.end){
                this.addUpdateNodeLinkMap(curLinkLine.end.id,curLinkLine.id);
            }

        }
        //linkmap维护
        if(!prevLineLine){
            this.oolongLinkMap.set(curLinkLine.id,curLinkLine);
        }else{
            if(curLinkLine.start){
                prevLineLine.start=curLinkLine.start;
            }
            if(curLinkLine.end){
                prevLineLine.end=curLinkLine.end;
            }
            this.oolongLinkMap.set(prevLineLine.id,prevLineLine);
        }
    }

    addUpdateNodeLinkMap(nodeId:string,linkId:string){
        const set=this.nodeLinkMap.get(nodeId);
        if(set){
            set.add(linkId);
        }else{
            const cache=new Set<string>();
            cache.add(linkId);
            this.nodeLinkMap.set(nodeId,cache);
        }
    }

    removeNodeLinkMap(nodeId:string,linkId:string){
        const set=this.nodeLinkMap.get(nodeId);
        if(set){
            set.delete(linkId);
        }
    }

    getLinkLine(nodeId:string):OolongLinkLine[]{
        const set=this.nodeLinkMap.get(nodeId);
        if(!set){
            return [];
        }
        const linkLines=[];
        for( const id of set){
            const linkLine=this.oolongLinkMap.get(id);
            if(linkLine){
                linkLines.push(linkLine);
            }
        }
        return linkLines;
    }

    getTextNode(id:string):OolongText|null{
        const idList=id.split("-");
        const targetId=idList[0];
        const nodeText=idList.length>1;
        let node=this.nodeMap.get(targetId);
        if(!node){
            node=this.lineMap.get(targetId);
            if(!node){
                return null;
            }
        }
        if(node.type===OolongNodeType.Shape){
            return (node as OolongNode).oolongText;
        }
        if(node.type===OolongNodeType.Line){
            return (node as OolongLine).oolongText;
        }
        if(nodeText){
            return (node as OolongNode).oolongText;
        }
        if(node.type!==OolongNodeType.Text){
            return null;
        }
        return node as OolongText;
    }

    /**
     * 移动过程中的对齐
     * @param moveRect 移动的rect
     * @param node 真实的节点bounds
     * @param viewBounds 可视屏幕范围
     * @param selectNodeSet 目前选中的节点列表
     * @param buffer
     */
    alignMove(moveRect:RectNode,node:RectNode,viewBounds:RectNode,selectNodeSet:Set<IGraphicElement>,buffer:number=2){
        //top & bottom
        const res1=AlignUtils.alignTopBottom(moveRect,node,viewBounds,this,selectNodeSet,buffer);
        //left & right
        const res2=AlignUtils.alignLeftRight(moveRect,node,viewBounds,this,selectNodeSet,buffer);
        if(res1 && !res2){
            return res1;
        }else if(!res1 && res2){
            return res2;
        }else if(res1 && res2){
            res1.dx=res2.dx;
            res1.lines.push(...res2.lines);
            return res1;
        }
        return null;
    }

    alignStretch(stretchRect:Rect,viewBounds:RectNode,selectNodeSet:Set<IGraphicElement>,stretchType:StretchType,buffer:number=2){
        let res1:AlignStretchResult|null=null;
        let res2:AlignStretchResult|null=null;
        if(stretchType===StretchType.TOP||stretchType===StretchType.TOP_LEFT||stretchType===StretchType.TOP_RIGHT
            ||stretchType===StretchType.BOTTOM||stretchType===StretchType.BOTTOM_LEFT||stretchType===StretchType.BOTTOM_RIGHT){
            res1=AlignUtils.alignTB4Stretch(stretchRect,viewBounds,selectNodeSet,this,buffer);
            if(res1){
                const cache:RectNode={minX:res1.stretchRect.x,maxX:res1.stretchRect.x+res1.stretchRect.width,
                    minY:res1.stretchRect.y,maxY:res1.stretchRect.y+res1.stretchRect.height,
                }
                res1.resList.push({isWidth:false,rectNode:cache});
            }
        }
        if(stretchType===StretchType.RIGHT||stretchType===StretchType.BOTTOM_RIGHT||stretchType===StretchType.TOP_RIGHT
            ||stretchType===StretchType.LEFT||stretchType===StretchType.BOTTOM_LEFT||stretchType===StretchType.TOP_LEFT){
            res2=AlignUtils.alignLR4Stretch(stretchRect,viewBounds,selectNodeSet,this,buffer);
            if(res2){
                const cache:RectNode={minX:res2.stretchRect.x,maxX:res2.stretchRect.x+res2.stretchRect.width,
                    minY:res2.stretchRect.y,maxY:res2.stretchRect.y+res2.stretchRect.height,
                }
                res2.resList.push({isWidth:true,rectNode:cache});
            }
        }
        if(res1 && !res2){
            return res1;
        }else if(!res1 && res2){
            return res2;
        }else if(res1 && res2){
            res1.stretchRect.width=res2.stretchRect.width;
            res1.resList.push(...res2.resList);
            return res1;
        }
        return null;
    }
}