import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import store from "@/store/RootStore";
import {updateTool} from "@/store/reducer/GlobalStateReducer";
import {ToolEnum} from "@/tool/ToolEnum";
import {OolongLineType} from "@/graphics/OolongLineType";

export class LKey extends HotKey {
    type: string=KeyCode.KeyL;
    work(_event: KeyboardEvent, context: OolongEventContext): void {
        context.toolManager.setCurrentTool(ToolEnum.LINE,OolongLineType.Line);
        context.setCursor("crosshair");
        store.dispatch(updateTool({tool:ToolEnum.LINE,shapeType:OolongLineType.Line}));
    }
    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}