import {OolongEventContext} from "@/interact/OolongEventContext";
import {IPasteHandler} from "@/copyPaste/paste/IPasteHandler";
import {IdGenerator} from "@/utils/IdGenerator";
import {OolongNodeType} from "@/graphics/OolongNodeType";
import {generateDefaultNodeDO, OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {Point} from "dahongpao-core";

export class OolongImgPasteHandler implements IPasteHandler {
    paste(e: ClipboardEvent, ctx: OolongEventContext): boolean {
        const data = e.clipboardData;
        if(!data){
            return false;
        }
        const blob=data.items[0].getAsFile();
        if(!blob){
            return false;
        }
        if(blob.type.indexOf('image')===-1){
            return false;
        }
        const nodeId=IdGenerator.genId(OolongNodeType.IMG);
        // const blobUrl=URL.createObjectURL(blob);
        ctx.imageManager.uploadBlobImg(nodeId,blob)
            .then((url)=>{
                const lastPoint=ctx.lastInteractiveEvent?.globalPoint||new Point(300,400);
                const nodeDO: OolongNodeDO = generateDefaultNodeDO(nodeId);
                nodeDO.type=OolongNodeType.IMG;
                nodeDO.zIndex = IdGenerator.genZIndex();
                nodeDO.x = lastPoint.x;
                nodeDO.y = lastPoint.y;
                nodeDO.w=100;
                nodeDO.h=100;
                nodeDO.imgSrc=url;
                const addLog=new AddNodeLog(nodeDO);
                ctx.actionManager.execAction(addLog);
            });
        return true;
    }


}