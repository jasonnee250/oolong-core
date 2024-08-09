import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import store from "@/store/RootStore";
import {updateTool} from "@/store/reducer/GlobalStateReducer";
import {ToolEnum} from "@/tool/ToolEnum";
import {OolongLineType} from "@/graphics/OolongLineType";

export class AKey extends HotKey {
    type: string=KeyCode.KeyA;
    work(_event: KeyboardEvent, context: OolongEventContext): void {
        context.toolManager.setCurrentTool(ToolEnum.LINE,OolongLineType.PolyLine);
        context.setCursor("crosshair");
        store.dispatch(updateTool({tool:ToolEnum.LINE,shapeType:OolongLineType.PolyLine}));
    }
    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}