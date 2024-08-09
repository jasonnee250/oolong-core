import {InteractiveEvent, InteractiveEventType, IProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {ParagraphHeadResult} from "@/interact/detector/ParagraphHeadDetector.ts";
import store from "@/store/RootStore.ts";
import {MenuType, setToolMenu} from "@/store/reducer/ToolMenuStateReducer.ts";
import {IGraphicElement, Point} from "dahongpao-core";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {ConnectPointRes} from "@/interact/detector/ConnectorPointDetector.ts";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType.ts";
import {HoverBound} from "@/auxiliary/graphics/HoverBound.ts";
import {HoverLine} from "@/auxiliary/graphics/HoverLine.ts";

export class HoverProcessor implements IProcessor {

    allowEventTypeSet = new Set([
        InteractiveEventType.pointermove,
    ])

    process(event: InteractiveEvent, ctx: OolongEventContext): void {
        //hover 节点探测
        const detector = ctx.detectors.get(OolongDetectorEnum.HoverNode);
        const connectDetector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);

        if (connectDetector && connectDetector.detect(event, ctx)) {
            const connectRes = connectDetector.result as ConnectPointRes;
            const g=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.HoverBounds) as HoverBound;
            const node=connectRes.node;
            g.update(node.getRectPoint(),node.getConnectPoint());
            ctx.auxiliaryManager.addRenderType(AuxiliaryType.HoverBounds);
        }else if (detector && detector.detect(event, ctx)) {
            const node = detector.result as IGraphicElement;
            if(node instanceof OolongNode){
                const g=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.HoverBounds) as HoverBound;
                g.update(node.getRectPoint(),node.getConnectPoint());
                ctx.auxiliaryManager.addRenderType(AuxiliaryType.HoverBounds);
            }else if(node instanceof OolongLine){
                const g=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.HoverLine) as HoverLine;
                g.updateProps(node.shapeType,node.points);
                ctx.auxiliaryManager.addRenderType(AuxiliaryType.HoverLine);
            }

        }

        const isTextSelect=ctx.auxiliaryManager.selectionManager.selectionList.length>0;
        if(isTextSelect){
            return;
        }
        //para段落探测
        const toolInfo = store.getState().toolMenuState.info;
        if(toolInfo.menuType===MenuType.QuickMenu||toolInfo.menuType===MenuType.DbClickQuickMenu){
            return;
        }
        const paraDetector = ctx.detectors.get(OolongDetectorEnum.ParagraphHead);
        const canBeDetectPara=toolInfo.menuType===MenuType.None ||toolInfo.menuType===MenuType.PopMenu||toolInfo.menuType===MenuType.ParagraphHead;
        if (canBeDetectPara && paraDetector && paraDetector.detect(event, ctx)) {
            const paraResult = paraDetector.result as ParagraphHeadResult;
            const clientPoint = ctx.gmlRender.transformToLocal(new Point(paraResult.point.x, paraResult.point.y));
            store.dispatch(setToolMenu({
                x: clientPoint.x, y: clientPoint.y,
                pIndex: paraResult.paragraph.index, pFontSize: paraResult.paragraph.fontSize,
                textListInfo:paraResult.paragraph.listInfo,
                menuType: MenuType.PopMenu
            }));
        } else {
            if(toolInfo.menuType===MenuType.PopMenu){
                return;
            }
            if (toolInfo.menuType !== MenuType.ParagraphHead && toolInfo.menuType !== MenuType.ActionMenu) {
                if(toolInfo.menuType!==MenuType.None){
                    store.dispatch(setToolMenu({x: 0, y: 0, menuType: MenuType.None}));
                }
            }
        }

    }

}