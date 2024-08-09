import {ClickHandler, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum";
import store from "@/store/RootStore";
import {MenuType, setToolMenu} from "@/store/reducer/ToolMenuStateReducer";

export class DbClickQuickCreateHandler extends ClickHandler{

    enable(event: InteractiveEvent, eventCtx: OolongEventContext): boolean {
        if(!eventCtx.onPage(event)){
            //不在当前页面
            return false;
        }
        if (event.originEvent.target !== eventCtx.gmlRender.canvas
            && event.originEvent.target !== eventCtx.auxiliaryCtx.gmlRender.canvas) {
            return false;
        }
        const detector=eventCtx.detectors.get(OolongDetectorEnum.Node);
        if(detector && detector.detect(event,eventCtx)){
            return false;
        }
        return true;
    }
    handle(event: InteractiveEvent, eventCtx: OolongEventContext): void {
        store.dispatch(setToolMenu({x:event.clientPoint.x,y:event.clientPoint.y,menuType:MenuType.DbClickQuickMenu}));
    }

}