import {OolongEventContext} from "@/interact/OolongEventContext";
import {IPasteHandler} from "@/copyPaste/paste/IPasteHandler";
import {IdGenerator} from "@/utils/IdGenerator";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {generateDefaultNodeDO, OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {OolongSVGUtils} from "@/graphics/OolongSVGUtils.ts";
import {Point} from "dahongpao-core";

export class OolongSvgPasteHandler implements IPasteHandler {
    paste(e: ClipboardEvent, ctx: OolongEventContext): boolean {
        const data = e.clipboardData;
        const textData = data?.getData("text/plain");
        if (!textData) {
            return false;
        }
        const res=this.getSvgCode(textData);
        if(res===null){
            return false;
        }
        const svgInfo=OolongSVGUtils.trimSvgCode(res);
        const lastPoint=ctx.lastInteractiveEvent?.globalPoint||new Point(300,400);
        const nodeId=IdGenerator.genId(OolongNodeType.SVG);
        const nodeDO: OolongNodeDO = generateDefaultNodeDO(nodeId);
        nodeDO.type=OolongNodeType.SVG;
        nodeDO.zIndex = IdGenerator.genZIndex();
        nodeDO.x = lastPoint.x;
        nodeDO.y = lastPoint.y;
        nodeDO.w=svgInfo.width;
        nodeDO.h=svgInfo.height;
        nodeDO.svgCode=svgInfo.svgCode;
        const addLog=new AddNodeLog(nodeDO);
        ctx.actionManager.execAction(addLog);
        return true;
    }


    getSvgCode(textData:string){
        const start=textData.indexOf("<svg");
        const end=textData.indexOf("svg>");
        if(start<0||end<0||start===end){
            return null;
        }
        const code=textData.slice(start,end+"svg>".length);
        return code;
    }

}