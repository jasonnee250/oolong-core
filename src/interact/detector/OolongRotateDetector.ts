import {AbsDetector, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {Point} from "dahongpao-core";
import {Rect} from "@/text/base/Rect";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";

export interface RotateInfo{
    rotateCenter:Point;
}

export class OolongRotateDetector extends AbsDetector<RotateInfo>{

    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean{
        const selectNodes=ctx.auxiliaryManager.selectManager.selectNodes;
        if(selectNodes.size===0){
            return false;
        }
        const buffer=10;
        if(selectNodes.size===1){
            const node=[...selectNodes][0];
            if(node instanceof OolongLine){
                return false;
            }
            const oolongNode=node as OolongNode;
            const localPoint=oolongNode.toLocalPoint(event.globalPoint);
            const center=new Point(
                oolongNode.x+0.5*oolongNode.w,
                oolongNode.y+0.5*oolongNode.h,
            )
            //top left
            if(localPoint.x>-0.5*oolongNode.w-buffer && localPoint.x<-0.5*oolongNode.w
                && localPoint.y>-0.5*oolongNode.h-buffer && localPoint.y<-0.5*oolongNode.h){
                this.result={
                    rotateCenter:center,
                }
                return true;
            }
            //top right
            if(localPoint.x>0.5*oolongNode.w&& localPoint.x<0.5*oolongNode.w+buffer
                && localPoint.y>-0.5*oolongNode.h-buffer && localPoint.y<-0.5*oolongNode.h){
                this.result={
                    rotateCenter:center,
                }
                return true;
            }
            //bottom right
            if(localPoint.x>0.5*oolongNode.w&& localPoint.x<0.5*oolongNode.w+buffer
                && localPoint.y>0.5*oolongNode.h && localPoint.y<0.5*oolongNode.h+buffer){
                this.result={
                    rotateCenter:center,
                }
                return true;
            }
            //bottom left
            if(localPoint.x>-0.5*oolongNode.w-buffer&& localPoint.x<-0.5*oolongNode.w
                && localPoint.y>0.5*oolongNode.h && localPoint.y<0.5*oolongNode.h+buffer){
                this.result={
                    rotateCenter:center,
                }
                return true;
            }
            return false;
        }
        const selectBounds=ctx.auxiliaryManager.selectManager.getSelectBounds();
        const center=new Point(
            0.5*(selectBounds.minX+selectBounds.maxX),
            0.5*(selectBounds.minY+selectBounds.maxY),
        )
        //top left
        if(Rect.contains(
            new Rect(selectBounds.minX-buffer,selectBounds.minY-buffer,buffer,buffer),
            event.globalPoint)
        ){
            this.result={
                rotateCenter:center,
            }
            return true;
        }
        //top right
        if(Rect.contains(
            new Rect(selectBounds.maxX,selectBounds.minY-buffer,buffer,buffer),
            event.globalPoint)
        ){
            this.result={
                rotateCenter:center,
            }
            return true;
        }
        //bottom right
        if(Rect.contains(
            new Rect(selectBounds.maxX,selectBounds.maxY,buffer,buffer),
            event.globalPoint)
        ){
            this.result={
                rotateCenter:center,
            }
            return true;
        }
        //bottom left
        if(Rect.contains(
            new Rect(selectBounds.minX-buffer,selectBounds.maxY,buffer,buffer),
            event.globalPoint)
        ){
            this.result={
                rotateCenter:center,
            }
            return true;
        }
        this.result=null;
        return false;
    }
}