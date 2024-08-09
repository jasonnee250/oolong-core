import {Point, RectNode} from "dahongpao-core";

export class Rect{
    x:number;
    y:number;
    width:number;
    height:number;

    constructor(x:number,y:number,width:number,height:number) {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }

    static contains(rect:Rect,p:Point){
        return p.x>=rect.x&& p.y<=rect.x+rect.width && p.y>=rect.y && p.y<=rect.y+rect.height;
    }

    static getRectBounds(rects:Rect[]):Rect{
        if(rects.length===0){
            return new Rect(0,0,0,0);
        }
        const sRect=rects[0];
        let minX=sRect.x;
        let minY=sRect.y;
        let maxX=sRect.x+sRect.width;
        let maxY=sRect.y+sRect.height;
        for(let i=1;i<rects.length;i++){
            const rect=rects[i];
            minX=minX>rect.x?rect.x:minX;
            minY=minY>rect.y?rect.y:minY;
            maxX=maxX<rect.x+rect.width?rect.x+rect.width:maxX;
            maxY=maxY<rect.y+rect.height?rect.y+rect.height:maxY;
        }
        return {
            x:minX,
            y:minY,
            width:maxX-minX,
            height:maxY-minY,
        }
    }

    static rect2RectNode(rect:Rect):RectNode{
        const {x,y,width,height}=rect;
        return {
            id:'rectNode',
            minX:x,
            minY:y,
            maxX:x+width,
            maxY:y+height,
        }
    }

    static rectNode2Rect(rect:RectNode):Rect{
        const {minY,minX,maxY,maxX}=rect;
        return {
            x:minX,
            y:minY,
            width:maxX-minX,
            height:maxY-minY,
        }
    }

    static points2Rect(points:Point[]):Rect{
        if(points.length===0){
            throw new Error("数据错误！")
        }
        if(points.length===1){
            const p=points[0];
            return {x:p.x,y:p.y,width:0,height:0};
        }
        const p0=points[0];
        let minX=p0.x;
        let minY=p0.y;
        let maxX=p0.x;
        let maxY=p0.y;
        for(let i=1;i<points.length;i++){
            const p=points[i];
            minX=minX>p.x?p.x:minX;
            minY=minY>p.y?p.y:minY;
            maxX=maxX<p.x?p.x:maxX;
            maxY=maxY<p.y?p.y:maxY;
        }
        return {
            x:minX,
            y:minY,
            width:maxX-minX,
            height:maxY-minY,
        }
    }
}