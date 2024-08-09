import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {ExecutorContext} from "../ExecutorContext";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog";
import {OolongText} from "@/text/base/OolongText";
import {ActionType} from "@/action/base/ActionType.ts";
import store from "@/store/RootStore.ts";
import {MenuType, setToolMenu} from "@/store/reducer/ToolMenuStateReducer.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {GraphicNode} from "dahongpao-core";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";

export class FocusTextExecutor extends AbsActionExecutor {
    exec(actionLog: FocusTextLog, ctx: ExecutorContext): void {

        //生成逆消息
        const nodeText=ctx.inputManager.typeWriter?.oolongText;
        const selectionList=ctx.auxiliaryManager.selectionManager.selectionList;
        if(nodeText){
            const textCursor=ctx.inputManager.typeWriter!.editPosition.serializeTo();
            if(nodeText.toNodeId){
                actionLog.reverseLog=new FocusTextLog(nodeText.toNodeId,FocusTextType.Editing,textCursor);
            }else {
                actionLog.reverseLog=new FocusTextLog(nodeText.id,FocusTextType.Editing,textCursor);
            }
        }else if(selectionList.length>0){
            const selectionManager=ctx.auxiliaryManager.selectionManager;
            actionLog.reverseLog=new FocusTextLog(selectionManager.text!.id,FocusTextType.Selection,selectionManager.start,selectionManager.end);
        } else{
            actionLog.reverseLog=new FocusTextLog(undefined,FocusTextType.Blur);
        }
        const {id,textCursorPosition,focusType,endTextCursorPosition}=actionLog;

        if(focusType===FocusTextType.Blur){
            this.blur(actionLog,ctx);
            return;
        }

        let node=ctx.nodeManager.nodeMap.get(id);
        if(!node){
            node=ctx.nodeManager.lineMap.get(id);
            if(!node){
                console.error("没有文字处于编辑状态");
                return;
            }
        }
        if(focusType===FocusTextType.Editing){
            this.focusOnEditCursor(node,actionLog,ctx);
        }else if(focusType===FocusTextType.Selection){
            this.focusOnSelection(node,actionLog,ctx);
        }else{
            this.blur(actionLog,ctx);
        }
    }

    type(): ActionType {
        return ActionType.FocusText;
    }

    focusOnSelection(node:GraphicNode,actionLog: FocusTextLog,ctx: ExecutorContext){
        let hideMenu=false;
        if(node.type===OolongNodeType.Text){
            hideMenu=true;
            const start=(node as OolongText).getPositionPtrFromCursorPosition(actionLog.textCursorPosition);
            const end=(node as OolongText).getPositionPtrFromCursorPosition(actionLog.endTextCursorPosition);
            ctx.auxiliaryManager.selectionManager.generateSelect(node as OolongText,start,end);
        }else if(node.type===OolongNodeType.Shape){
            const start=(node as OolongNode).oolongText!.getPositionPtrFromCursorPosition(actionLog.textCursorPosition);
            const end=(node as OolongNode).oolongText!.getPositionPtrFromCursorPosition(actionLog.endTextCursorPosition);
            ctx.auxiliaryManager.selectionManager.generateSelect((node as OolongNode).oolongText!,start,end);
        }else if(node.type===OolongNodeType.Line){
            const oolongLine=node as OolongLine;
            if(!oolongLine.oolongText){
                oolongLine.initText();
            }
            const start=oolongLine.oolongText!.getPositionPtrFromCursorPosition(actionLog.textCursorPosition);
            const end=oolongLine.oolongText!.getPositionPtrFromCursorPosition(actionLog.endTextCursorPosition);
            ctx.auxiliaryManager.selectionManager.generateSelect(oolongLine.oolongText!,start,end);
        }else{
            console.error("类型错误，该类型节点下不能编辑文字");
            return;
        }
    }

    focusOnEditCursor(node:GraphicNode,actionLog: FocusTextLog,ctx: ExecutorContext){
        let hideMenu=false;
        ctx.auxiliaryManager.clearTextSelection();

        if(node.type===OolongNodeType.Text){
            hideMenu=true;
            ctx.inputManager.loadTypeWriter(node as OolongText,ctx.pageManager);
        }else if(node.type===OolongNodeType.Shape){
            ctx.inputManager.loadTypeWriter((node as OolongNode).oolongText!,ctx.pageManager);
        }else if(node.type===OolongNodeType.Line){
            const oolongLine=node as OolongLine;
            if(!oolongLine.oolongText){
                oolongLine.initText();
            }
            ctx.inputManager.loadTypeWriter(oolongLine.oolongText!,ctx.pageManager);
        }else{
            console.error("类型错误，该类型节点下不能编辑文字");
            return;
        }
        ctx.inputManager.typeWriter!.loadEditPosition(actionLog.textCursorPosition);
        ctx.inputManager.focus();
        ctx.auxiliaryManager.renderToolMenu();
        if(hideMenu){
            store.dispatch(setToolMenu({x:0,y:0,menuType:MenuType.None}));
        }

    }

    blur(actionLog: FocusTextLog,ctx: ExecutorContext){
        const typeWriter=ctx.inputManager.typeWriter;
        if(!typeWriter){
            console.warn("目前没有节点处于focus，不需要blur");
            return;
        }
        ctx.auxiliaryManager.clearTextSelection();
        const oolongText=typeWriter.oolongText;
        if(oolongText.toNodeId!==null){
            const node=ctx.nodeManager.nodeMap.get(oolongText.toNodeId) as OolongNode|undefined;
            if(node){
                const cachePos=node.computeTextPos()!;
                oolongText.updatePos(cachePos);
                const cursorPosition=new TextCursorPosition(0,0,-1);
                const positionPtr=oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                oolongText.reTypesetting(ctx.pageManager,positionPtr,node);
                ctx.renderManager.addDrawNode(node);
            }
            const line=ctx.nodeManager.lineMap.get(oolongText.toNodeId) as OolongLine|undefined;
            if(line){
                const cachePos=line.computeTextPos();
                oolongText.updatePos(cachePos);
                const cursorPosition=new TextCursorPosition(0,0,-1);
                const positionPtr=oolongText.getPositionPtrFromCursorPosition(cursorPosition);
                oolongText.reTypesetting(ctx.pageManager,positionPtr);
                ctx.renderManager.addDrawNode(line);
            }
        }
        ctx.inputManager.blur();
    }

}