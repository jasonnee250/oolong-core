import {OolongEventContext} from "@/interact/OolongEventContext";
import {ICopyHandler} from "@/copyPaste/copy/ICopyHandler";
import {CopyPasteUtils} from "@/copyPaste/utils/CopyPasteUtils.ts";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {PasteData, PasteType} from "@/copyPaste/base/PasteData.ts";

export class CopyNodeHandler implements ICopyHandler {
    copy(e: ClipboardEvent, ctx: OolongEventContext): boolean {
        const selectManager=ctx.auxiliaryManager.selectManager;
        if(selectManager.selectNodes.size===0){
            return false;
        }
        const nodeSet=selectManager.selectNodes;
        if(nodeSet.size===0){
            return false;
        }
        if(!e.clipboardData){
            return false;
        }
        e.preventDefault();
        const nodeDOList:OolongNodeDO[]=[];
        for(const node of nodeSet){
            nodeDOList.push(node.serializeTo());
        }
        const pasteData:PasteData={
            nodes:nodeDOList,
            pasteType:PasteType.Nodes,
        }
        const data=JSON.stringify(pasteData);
        const encode=CopyPasteUtils.encode(data);
        e.clipboardData.setData('text/html',encode);
        return true;
    }
}