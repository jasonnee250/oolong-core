import {InteractiveEvent, InteractiveEventType, IProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {StretchInfo, StretchType} from "@/interact/detector/OolongStretchDetector.ts";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {ControlPointRes} from "@/interact/detector/PolyLineControlPointDetector.ts";

export class CursorProcessor implements IProcessor {

    allowEventTypeSet=new Set([
        InteractiveEventType.pointermove,
    ])
    process(event: InteractiveEvent, ctx: OolongEventContext): void {
        if(ctx.toolManager.currentTool===ToolEnum.SHAPE){
            ctx.setCursor("crosshair");
            return;
        }
        if(ctx.toolManager.currentTool===ToolEnum.LINE){
            ctx.setCursor("crosshair");
            return;
        }
        if(ctx.toolManager.currentTool===ToolEnum.TEXT){
            ctx.setCursor("text");
            return;
        }
        const cpDetector = ctx.detectors.get(OolongDetectorEnum.PolyControlPoint);
        if(cpDetector && cpDetector.detect(event,ctx)){
            const result=cpDetector.result as ControlPointRes;
            if(result.isHorizon){
                ctx.setCursor("ns-resize");
            }else{
                ctx.setCursor("ew-resize");
            }
            return;
        }
        const lineEndDetector=ctx.detectors.get(OolongDetectorEnum.LineEndPoint);
        if(lineEndDetector && lineEndDetector.detect(event,ctx)){
            ctx.setCursor("move");
            return;
        }
        const detector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
        if (detector && detector.detect(event, ctx)) {
            ctx.setCursor("crosshair");
            return;
        }
        const rotateDetector = ctx.detectors.get(OolongDetectorEnum.Rotate);
        if (rotateDetector && rotateDetector.detect(event, ctx)) {
            //鼠标样式待替换
            ctx.setCursor("grab");
            return ;
        }
        const singleStretchDetector = ctx.detectors.get(OolongDetectorEnum.SingleStretch);
        if (singleStretchDetector && singleStretchDetector.detect(event, ctx)) {
            const res=singleStretchDetector.result as StretchInfo;
            if(res.type===StretchType.BOTTOM||res.type===StretchType.TOP){
                ctx.setCursor("ns-resize");
            }else if(res.type===StretchType.RIGHT||res.type===StretchType.LEFT){
                ctx.setCursor("ew-resize");
            }else if(res.type===StretchType.TOP_LEFT||res.type===StretchType.BOTTOM_RIGHT){
                ctx.setCursor("nwse-resize");
            }else if(res.type===StretchType.TOP_RIGHT||res.type===StretchType.BOTTOM_LEFT){
                ctx.setCursor("nesw-resize");
            }
            return;
        }
        const strechDetector = ctx.detectors.get(OolongDetectorEnum.Stretch);
        if (strechDetector && strechDetector.detect(event, ctx)) {
            const res=strechDetector.result as StretchInfo;
            if(res.type===StretchType.BOTTOM||res.type===StretchType.TOP){
                ctx.setCursor("ns-resize");
            }else if(res.type===StretchType.RIGHT||res.type===StretchType.LEFT){
                ctx.setCursor("ew-resize");
            }else if(res.type===StretchType.TOP_LEFT||res.type===StretchType.BOTTOM_RIGHT){
                ctx.setCursor("nwse-resize");
            }else if(res.type===StretchType.TOP_RIGHT||res.type===StretchType.BOTTOM_LEFT){
                ctx.setCursor("nesw-resize");
            }
            return;
        }
        const nodeDetector = ctx.detectors.get(OolongDetectorEnum.HoverNode);
        if (nodeDetector && nodeDetector.detect(event, ctx)) {
            ctx.setCursor("default");
            return;
        }
        if(ctx.inputManager.typeWriter!==null && ctx.onPage(event)){
            ctx.setCursor("text");
            return;
        }
        ctx.setCursor("default");


    }
}