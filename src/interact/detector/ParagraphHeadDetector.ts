import {AbsDetector, InteractiveEvent} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext";
import {MainTextId} from "@/text/config/OolongTextConstants";
import {OolongText} from "@/text/base/OolongText";
import {Point} from "dahongpao-core";
import {OolongParagraph} from "@/text/base/OolongParagraph.ts";

export interface ParagraphHeadResult {
    paragraph: OolongParagraph;
    point: Point;
}

export class ParagraphHeadDetector extends AbsDetector<ParagraphHeadResult> {
    _onDetect(event: InteractiveEvent, ctx: OolongEventContext): boolean {
        const mainText = ctx.nodeManager.nodeMap.get(MainTextId);
        if (!mainText) {
            return false;
        }
        const text = mainText as OolongText;
        const textPos = text.getGlobalPos();
        let pIter = text.head.next;
        if (!ctx.onPage(event)) {
            return false;
        }
        while (pIter && pIter.data) {

            const rect = pIter.data.getRect();
            const fontSize=pIter.data.fontSize;
            if (event.globalPoint.y > rect.y && event.globalPoint.y < rect.y + rect.height) {
                this.result = {
                    paragraph: pIter.data!,
                    point: new Point(textPos.x, rect.y+0.5*(fontSize-16)),
                };
                return true;
            }
            pIter = pIter.next;
        }

        return false;
    }

}