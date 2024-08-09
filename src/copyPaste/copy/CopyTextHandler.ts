import {OolongEventContext} from "@/interact/OolongEventContext";
import {ICopyHandler} from "@/copyPaste/copy/ICopyHandler";
import {EditPositionInfo} from "@/text/base/EditPositionInfo";
import {OolongParagraphDO} from "@/file/text/OolongParagraphDO";
import {OolongLineDO} from "@/file/text/OolongLineDO";
import {CopyPasteUtils} from "@/copyPaste/utils/CopyPasteUtils.ts";
import {PasteData, PasteType} from "@/copyPaste/base/PasteData.ts";

export class CopyTextHandler implements ICopyHandler {
    copy(e: ClipboardEvent, ctx: OolongEventContext): boolean {
        const selectionManager=ctx.auxiliaryManager.selectionManager;
        if(selectionManager.selectionList.length===0){
            return false;
        }
        const textNode=selectionManager.text;
        if(!textNode){
            return false;
        }
        if(!e.clipboardData){
            return false;
        }
        e.preventDefault();
        const start=selectionManager.start!;
        const end=selectionManager.end!;
        const startPositionPtr=textNode.getPositionPtrFromCursorPosition(start);
        const endPositionPtr=textNode.getPositionPtrFromCursorPosition(end);
        const paragraphDOList=this.serializeToParagraphDO(startPositionPtr,endPositionPtr);
        const pasteData:PasteData={
            pasteType:PasteType.TextContent,
            paragraphs:paragraphDOList,
        }
        const data=JSON.stringify(pasteData);
        const encode=CopyPasteUtils.encode(data);
        e.clipboardData.setData('text/html',encode);
        return true;
    }

    serializeToParagraphDO(startPositionPtr:EditPositionInfo,endPositionPtr:EditPositionInfo):OolongParagraphDO[]{
        const originPIter = startPositionPtr.paragraphPtr!;
        const originLineIter = startPositionPtr.linePtr!;
        const originCharIter = startPositionPtr.charPtr!;
        const originCharIndex=originCharIter.data===null?0:originCharIter.data.index;

        const curPIter = endPositionPtr.paragraphPtr!;
        const curLineIter = endPositionPtr.linePtr!;
        const curCharIter = endPositionPtr.charPtr!;
        const curCharIndex=curCharIter.data===null?0:curCharIter.data.index;
        /** 相同段落+相同行 */
        if (originPIter === curPIter && originLineIter === curLineIter) {
            const lineDO=originLineIter.data!.serializeToInterval(originCharIndex,curCharIndex);
            return [{
                lines:[lineDO],
                index:originPIter.data!.index,
                fontSize: originPIter.data!.fontSize,
                listInfo:originPIter.data!.listInfo,
                horizonAlign:originPIter.data!.horizonAlign,
            }]
        }
        /** 相同段落+不同行 */
        if (originPIter === curPIter && originLineIter !== curLineIter) {
            const lines:OolongLineDO[]=[];
            const lineDO=originLineIter.data!.serializeToInterval(originCharIndex,null);
            lines.push(lineDO);
            let iter=originLineIter.next;
            while (iter && iter.data && iter!=curLineIter){
                const cacheLineDO=iter.data!.serializeTo();
                lines.push(cacheLineDO);
                iter=iter.next;
            }
            const endLineDO=curLineIter.data!.serializeToInterval(0,curCharIndex);
            lines.push(endLineDO);
            return [{
                lines:lines,
                index:originPIter.data!.index,
                fontSize: originPIter.data!.fontSize,
                listInfo:originPIter.data!.listInfo,
                horizonAlign:originPIter.data!.horizonAlign,
            }]
        }
        /** 不同段落 */
        if (originPIter !== curPIter) {
            /** A段落 */
            //首行
            const lines:OolongLineDO[]=[];
            const lineDO=originLineIter.data!.serializeToInterval(originCharIndex,null);
            lines.push(lineDO);
            //到最后一行
            {
                const iter=originLineIter.next;
                while (iter && iter.data){
                    const endLineDO=curLineIter.data!.serializeToInterval(0,curCharIndex);
                    lines.push(endLineDO);
                }
            }
            const paragraphDOList:OolongParagraphDO[]=[];
            const paragraphDO={
                lines:lines,
                index:originPIter.data!.index,
                fontSize: originPIter.data!.fontSize,
                listInfo:originPIter.data!.listInfo,
                horizonAlign:originPIter.data!.horizonAlign,
            }
            paragraphDOList.push(paragraphDO);
            /** 中间段落 */
            let cachePtr=originPIter.next;
            while (cachePtr && cachePtr.data && cachePtr!==curPIter) {
                const cache=cachePtr.data.serializeTo();
                paragraphDOList.push(cache);
                cachePtr=cachePtr.next;
            }
            /** B段落 */
            //到最后一行前一行
            {
                let iter=curPIter.data!.head.next;
                const lines:OolongLineDO[]=[];
                while (iter && iter.data && iter!==curLineIter){
                    const cache=iter.data!.serializeTo();
                    lines.push(cache);
                    iter=iter.next;
                }
                const endLine=curLineIter.data!.serializeToInterval(0,curCharIndex);
                lines.push(endLine);
                const endParagraphDO={
                    lines:lines,
                    index:curPIter.data!.index,
                    fontSize: curPIter.data!.fontSize,
                    listInfo:curPIter.data!.listInfo,
                    horizonAlign:curPIter.data!.horizonAlign,
                }
                paragraphDOList.push(endParagraphDO);
            }
            return paragraphDOList;
        }
        return [];
    }

}