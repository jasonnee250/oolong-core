import {OolongEventContext} from "@/interact/OolongEventContext";
import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig";
import store from "@/store/RootStore";
import {updateTool} from "@/store/reducer/GlobalStateReducer";
import {ToolEnum} from "@/tool/ToolEnum";
import {OolongShapeType} from "@/graphics/OolongShapeType";

export class RKey extends HotKey {
    type: string=KeyCode.KeyR;
    work(_event: KeyboardEvent, context: OolongEventContext): void {
        context.toolManager.setCurrentTool(ToolEnum.SHAPE,OolongShapeType.Rect);
        context.setCursor("crosshair");
        store.dispatch(updateTool({tool:ToolEnum.SHAPE,shapeType:OolongShapeType.Rect}));
    }
    enable(_event: KeyboardEvent): boolean {
        return true;
    }

}