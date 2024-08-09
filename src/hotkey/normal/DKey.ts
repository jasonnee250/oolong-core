import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import {OolongNode} from "@/graphics/OolongNode";
import {IdGenerator} from "@/utils/IdGenerator";
import {TextCursorPosition} from "@/text/base/TextCursorPosition";
import {InteractiveUtils} from "dahongpao-canvas";
import {AddNodeLog} from "@/action/log/node/AddNodeLog";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";

export class DKey extends HotKey {
    type: string=KeyCode.KeyD;
    work(event: KeyboardEvent, context: OolongEventContext): void {
        const selectNodes=context.auxiliaryManager.selectManager.selectNodes;
        if(selectNodes.size===0){
            return;
        }
        let dx=100;
        let dy=100;
        const selectBounds=context.auxiliaryManager.selectManager.getSelectBounds();

        const optHelper=context.auxiliaryManager.selectManager.optionHelper;
        if(optHelper.isWorking){
            dx=selectBounds.minX-optHelper.originX;
            dy=selectBounds.minY-optHelper.originY;
        }
        event.preventDefault();
        context.execAction(new StartLog());
        const idList:string[]=[];
        for(const selectNode of selectNodes){
            const oolongDO=selectNode.serializeTo();
            oolongDO.id=IdGenerator.genId(oolongDO.type);
            oolongDO.zIndex=IdGenerator.genZIndex();
            oolongDO.x+=dx;
            oolongDO.y+=dy;
            context.execAction(new AddNodeLog(oolongDO));
            idList.push(oolongDO.id);
        }
        context.execAction(new SelectNodeLog(idList));
        context.execAction(new EndLog());

        optHelper.startWorking(idList,selectBounds.minX,selectBounds.minY);
    }
    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}