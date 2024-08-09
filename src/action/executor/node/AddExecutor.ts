import { ActionType } from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {AddNodeLog} from "@/action/log/node/AddNodeLog";
import {OolongNode} from "@/graphics/OolongNode";
import {InteractiveUtils} from "dahongpao-canvas";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongSVGNode} from "@/graphics/OolongSVGNode.ts";
import {OolongImgNode} from "@/graphics/OolongImgNode.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";

export class AddExecutor extends AbsActionExecutor {
    exec(actionLog: AddNodeLog, ctx: ExecutorContext): void {
        const glCtx=ctx.gmlRender.canvas!.getContext("2d")!;
        if(actionLog.nodeData.type===OolongNodeType.SVG){
            const node= OolongSVGNode.load(actionLog.nodeData,glCtx,ctx.pageManager);
            ctx.nodeManager.addNode(node);
            (node as OolongSVGNode).generateTexture().then(p=>{
                this.addAndDraw(p,ctx);
            });
        }else if(actionLog.nodeData.type===OolongNodeType.IMG){
            const node= OolongImgNode.load(actionLog.nodeData,glCtx,ctx.pageManager) as OolongImgNode;
            ctx.nodeManager.addNode(node);
            node.loadImg(true).then(p=>{
                this.addAndDraw(p,ctx);
            })
        }else{
            const node= OolongNode.load(actionLog.nodeData,glCtx,ctx.pageManager);
            /** 矫正输入文字 */
            const textPos=node.computeTextPos();
            if(node.oolongText && textPos){
                node.oolongText.updatePos(textPos);
                const cursorPosition = new TextCursorPosition(0, 0, -1);
                const positionPtr = node.oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                node.oolongText.reTypesetting(ctx.pageManager, positionPtr, node);
            }



            ctx.nodeManager.addNode(node);
            this.addAndDraw(node,ctx);
        }

    }

    addAndDraw(node:OolongNode,ctx:ExecutorContext){
        ctx.renderManager.addDrawNode(node);
    }
    type(): ActionType {
        return ActionType.AddNode;
    }
    
}