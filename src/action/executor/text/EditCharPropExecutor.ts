import {ActionType} from "@/action/base/ActionType";
import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {EditCharPropLog} from "@/action/log/text/EditCharPropLog";
import {OolongText} from "@/text/base/OolongText";
import {IGraphicElement, RectNode} from "dahongpao-core";
import {OolongCharacter} from "@/text/base/OolongCharacter.ts";
import {OolongNodeManager} from "@/app/OolongNodeManager.ts";


export class EditCharPropExecutor extends AbsActionExecutor {
    exec(actionLog: EditCharPropLog, ctx: ExecutorContext): void {
        const nodeId=actionLog.nodeId;
        const node=(ctx.nodeManager as OolongNodeManager).getTextNode(nodeId);
        if(!node){
            throw new Error("node 不存在！")
        }
        if(!(node instanceof OolongText)){
            throw new Error("node 类型错误，不是text类型！")
        }
        const textNode=node as OolongText;
        const start=actionLog.start;
        const end=actionLog.end;
        //todo 需要一个算法，计算从start到end的所有字符，然后修改颜色;

        const startPositionPtr=textNode.getPositionPtrFromCursorPosition(start);
        const endPositionPtr=textNode.getPositionPtrFromCursorPosition(end);

        const callBack=(p:OolongCharacter)=>{
            const charInfo=actionLog.charPropInfo;
            if(charInfo.color!=undefined){
                p.color=charInfo.color;
            }
            if(charInfo.bold!=undefined){
                p.bold=charInfo.bold;
            }
            if(charInfo.italic!=undefined){
                p.italic=charInfo.italic;
            }
            if(charInfo.bgColor!=undefined){
                if(charInfo.bgColor==="none"){
                    p.backgroundColor=undefined;
                }else{
                    p.backgroundColor=charInfo.bgColor;
                }
            }
            if(charInfo.strikeThrough!=undefined){
                p.strikeThrough=charInfo.strikeThrough;
            }
            if(charInfo.underline!=undefined){
                p.underline=charInfo.underline;
            }
            return false;
        }
        textNode.traversal(startPositionPtr,endPositionPtr,callBack);

        //todo 逆操作颜色生成处理
        actionLog.reverseLog=new EditCharPropLog(actionLog.nodeId,start,end,{color:textNode.fontColor});
        //重绘&渲染
        ctx.renderManager.addDrawNode(node);


        ctx.auxiliaryManager.renderToolMenu();

    }
    type(): ActionType {
        return ActionType.EditCharProp;
    }

    _bufferBounds(bounds: RectNode,scale:number,buffer=2){
        bounds.minX = Math.round((bounds.minX) * scale - buffer) / scale;
        bounds.minY = Math.round((bounds.minY) * scale - buffer) / scale;
        bounds.maxX = Math.round((bounds.maxX) * scale + 2 * buffer) / scale;
        bounds.maxY = Math.round((bounds.maxY) * scale + 2 * buffer) / scale;
    }

}