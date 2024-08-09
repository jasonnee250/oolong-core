import {GraphicUtils, Point} from "dahongpao-core";
import {CanvasGraphicNode, InteractiveUtils} from "dahongpao-canvas";
import {OolongEventContext} from "@/interact/OolongEventContext.ts";
import {BaseText} from "dahongpao-canvas/dist/graphics/text/BaseText";

export class TextUtils {

    static updateTextDraw(node: CanvasGraphicNode, textChar: string, ctx: OolongEventContext) {
        const prev = node.getTextBounds();
        ctx.inputManager.input(textChar);
        const current = node.getTextBounds();
        const bounds = GraphicUtils.getBounds([prev, current]);
        InteractiveUtils.bufferBounds(bounds, ctx, 5);
        const graphics = InteractiveUtils.needDrawByMoving(ctx, bounds, new Set<string>(), node);
        ctx.gmlRender.dirtyDraw(bounds, graphics);
    }

    static generateAddCharListBase(text: string,
                                   glCtx: CanvasRenderingContext2D,
                                   fontSize: number,
                                   startPoint: Point = {x: 0, y: 0},
                                   colIndex: number = 0,
    ): BaseText[] {
        const charTextList: BaseText[] = [];
        glCtx.font = fontSize.toString() + 'px Arial';
        const y = startPoint.y;
        let x = startPoint.x;
        for (let i = colIndex + 1; i < text.length + 1; i++) {
            const charText = text.slice(0, i);
            const result = glCtx.measureText(charText);
            const height = result.fontBoundingBoxAscent + result.fontBoundingBoxDescent;
            const width = result.width;
            const baseText: BaseText = {
                text,
                height,
                width,
                x,
                y,
            }
            x = x + width;
            charTextList.push(baseText);
        }
        return charTextList;
    }

    static generateAddCharList(node: CanvasGraphicNode, rowIndex: number, colIndex: number): BaseText[] {
        const nodeTextInfoList = node.textInfo.baseTextList as BaseText[];
        const rowText = nodeTextInfoList[rowIndex];
        if(!rowText){
            return [];
        }
        const text = rowText.text;
        const charTextList: BaseText[] = [];
        node.graphicContext.font = node.fontSize.toString() + 'px Arial';
        const y = rowText.y;
        let x = rowText.x;
        for (let i = colIndex + 1; i < text.length + 1; i++) {
            const charText = text.slice(0, i);
            const result = node.graphicContext.measureText(charText);
            const height = result.fontBoundingBoxAscent + result.fontBoundingBoxDescent;
            const width = result.width;
            const baseText: BaseText = {
                text,
                height,
                width,
                x,
                y,
            }
            x = x + width;
            charTextList.push(baseText);
        }
        return charTextList;
    }

    static generateCharList(node: CanvasGraphicNode, rowIndex: number): BaseText[] {

        return this.generateAddCharList(node, rowIndex, 0);
    }

}