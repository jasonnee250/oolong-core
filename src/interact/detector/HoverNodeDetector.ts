import {AbsDetector, InteractiveEvent} from "dahongpao-canvas";
import {GraphicUtils, IGraphicElement} from "dahongpao-core";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {OolongDetectorEnum} from "@/interact/detector/OolongDetectorEnum.ts";
import {MainTextId} from "@/text/config/OolongTextConstants.ts";

export class HoverNodeDetector extends AbsDetector<IGraphicElement>{
    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const connectDetector = ctx.detectors.get(OolongDetectorEnum.ConnectorPoint);

        if (connectDetector && connectDetector.detect(event, ctx)){
            return false;
        }
        const lineEndDetector=ctx.detectors.get(OolongDetectorEnum.LineEndPoint);
        if(lineEndDetector && lineEndDetector.detect(event,ctx)){
            return false;
        }
        const strechDetector = ctx.detectors.get(OolongDetectorEnum.Stretch);
        if (strechDetector && strechDetector.detect(event, ctx)){
            return false;
        }
        const selectManager=ctx.auxiliaryManager.selectManager;
        const selectBounds=selectManager.getSelectBounds();
        const inSelect=GraphicUtils.rectContains2(event.globalPoint,selectBounds);
        if(inSelect){
            return false;
        }
        const nodeDetector=ctx.detectors.get(OolongDetectorEnum.Node);
        if(nodeDetector && nodeDetector.detect(event,ctx)){
            const nodeList=nodeDetector.result as IGraphicElement[];
            for(const node of nodeList){
                if(node.id===MainTextId){
                    continue;
                }
                this.result=node;
                return true;
            }
        }
        return false;


    }

}