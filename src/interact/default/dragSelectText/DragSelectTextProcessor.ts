import {InteractiveEvent, StreamProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongText} from "@/text/base/OolongText";
import {EditPositionInfo} from "@/text/base/EditPositionInfo";
import {Point} from "dahongpao-core";
import store from "@/store/RootStore.ts";
import {MenuType, setToolMenu} from "@/store/reducer/ToolMenuStateReducer.ts";
import {Rect} from "@/text/base/Rect.ts";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

export class DragSelectTextProcessor extends StreamProcessor{

    private originPosition:EditPositionInfo|null=null;
    editText:OolongText|null=null;

    getNodeId(oolongText:OolongText){
        if(!oolongText.toNodeId){
            return oolongText.id;
        }
        return oolongText.toNodeId;
    }
    onStart(_event: InteractiveEvent, ctx: OolongEventContext): void {
        let oolongText;
        if(ctx.auxiliaryManager.selectionManager.selectionList.length>0){
            oolongText=ctx.auxiliaryManager.selectionManager.text!;
        }else {
            oolongText=ctx.inputManager.typeWriter!.oolongText;
        }
        this.editText=oolongText;
        ctx.execAction(new StartLog());
        ctx.execAction(new FocusTextLog(undefined,FocusTextType.Blur));
        const editPosition=oolongText.detect(ctx.lastDiffTypeEvent!.globalPoint);
        this.originPosition=editPosition;
        store.dispatch(setToolMenu({x:0,y:0,menuType:MenuType.None}));
    }
    onMove(event: InteractiveEvent, ctx: OolongEventContext): void {
        const oolongText=this.editText!;
        const editPosition=oolongText.detect(event.globalPoint);
        const nodeId=this.getNodeId(oolongText);
        ctx.execAction(new FocusTextLog(nodeId,FocusTextType.Selection,this.originPosition!.serializeTo(),editPosition.serializeTo()))
    }
    onUp(event: InteractiveEvent, ctx: OolongEventContext): void {
        const oolongText=this.editText!;
        const editPosition=oolongText.detect(event.globalPoint);
        const nodeId=this.getNodeId(oolongText);
        if(this.originPosition!.equal(editPosition)){
             ctx.execAction(new FocusTextLog(nodeId,FocusTextType.Editing,editPosition.serializeTo()));
             ctx.execAction(new EndLog());
            return;
        }
        ctx.execAction(new FocusTextLog(nodeId,FocusTextType.Selection,this.originPosition!.serializeTo(),editPosition.serializeTo()));
        const selectManager=ctx.auxiliaryManager.selectManager;
        if(selectManager.selectNodes.size>0){
            const selectBound=selectManager.getSelectBounds();
            const globalPoint=new Point(selectBound.minX,selectBound.minY);
            const clientPoint=ctx.gmlRender.transformToLocal(new Point(globalPoint.x,globalPoint.y-45));
            store.dispatch(setToolMenu({x:clientPoint.x,y:clientPoint.y,menuType:MenuType.ActionMenu}));
            ctx.auxiliaryManager.renderToolMenu();
            ctx.execAction(new EndLog());
            return;
        }
        ctx.auxiliaryManager.renderToolMenu();
        ctx.execAction(new EndLog());
        // ctx.inputManager.onlyInputFocus(clientPoint);

    }

}