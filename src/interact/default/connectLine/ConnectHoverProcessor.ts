import {InteractiveEvent, InteractiveEventType, IProcessor} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {HoverDrawer} from "@/interact/default/normal/HoverDrawer.ts";
import {ConnectPointRes} from "@/interact/detector/ConnectorPointDetector.ts";
import {IGraphicElement} from "dahongpao-core";
import {MainTextId} from "@/text/config/OolongTextConstants.ts";
import {AuxiliaryType} from "@/auxiliary/graphics/AuxiliaryType.ts";
import {HoverBound} from "@/auxiliary/graphics/HoverBound.ts";

export class ConnectHoverProcessor implements IProcessor {

    allowEventTypeSet = new Set([
        InteractiveEventType.pointermove,
    ])

    process(event: InteractiveEvent, ctx: OolongEventContext): void {
        //hover 节点探测

        const nodeDetector=ctx.detectors.get(OolongDetectorEnum.Node);
        if(nodeDetector && nodeDetector.detect(event,ctx)){
            const nodeList=nodeDetector.result as IGraphicElement[];
            for(const node of nodeList){
                if(node.id===MainTextId){
                    continue;
                }
                if(node instanceof OolongNode){
                    const g=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.HoverBounds) as HoverBound;
                    g.update(node.getRectPoint(),node.getConnectPoint());
                    ctx.auxiliaryManager.addRenderType(AuxiliaryType.HoverBounds);
                    return;
                }
            }
        }

        const connectDetector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);
        if (connectDetector && connectDetector.detect(event, ctx)) {
            const connectRes = connectDetector.result as ConnectPointRes;
            const g=ctx.auxiliaryManager.graphicMap.get(AuxiliaryType.HoverBounds) as HoverBound;
            const node=connectRes.node;
            g.update(node.getRectPoint(),node.getConnectPoint());
            ctx.auxiliaryManager.addRenderType(AuxiliaryType.HoverBounds);

        }

    }

}