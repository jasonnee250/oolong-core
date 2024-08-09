import {GraphicUtils, IGraphicElement, Point, RectNode} from "dahongpao-core";
import {OolongText} from "@/text/base/OolongText";
import store from "@/store/RootStore";
import {updateScale} from "@/store/reducer/GlobalStateReducer";
import {GMLRender} from "dahongpao-core/dist/render/GMLRender";
import {NodeManager} from "dahongpao-canvas";

export class WheelUtils {

    static scroll(deltaX: number, deltaY: number, gmlRender: GMLRender, nodeManager: NodeManager) {
        const prevRectBounds: RectNode = gmlRender.getViewPortBounds();

        //平移
        gmlRender.translation(-deltaX, -deltaY);

        const nextRectBounds: RectNode = gmlRender.getViewPortBounds();

        const rectBounds = GraphicUtils.getBounds([prevRectBounds, nextRectBounds]);

        const ctx = gmlRender.canvas!.getContext("2d")!;

        const {a, b, c, d, e, f} = gmlRender.globalTransform;
        ctx.setTransform(a, b, c, d, e, f);

        ctx.clearRect(rectBounds.minX, rectBounds.minY, rectBounds.maxX - rectBounds.minX, rectBounds.maxY - rectBounds.minY);
        const result = nodeManager.tree.search(rectBounds);

        //整理需要重新绘制的对象
        const graphicSet = new Set<IGraphicElement>();
        for (const treeNode of result) {
            const node = nodeManager.nodeMap.get(treeNode.id);
            if (node) {
                graphicSet.add(node);
            }
            const line = nodeManager.lineMap.get(treeNode.id);
            if (line) {
                graphicSet.add(line);
            }
        }
        const graphicList = [...graphicSet];
        graphicList.sort((a, b) => a.zIndex - b.zIndex);
        const rect = gmlRender.getViewPortBounds();
        for (const graphic of graphicList) {
            if (graphic instanceof OolongText) {
                (graphic as OolongText).drawVisible(rect);
            } else {
                graphic.draw();
            }
        }
        const globalScale = gmlRender.globalTransform.a;
        store.dispatch(updateScale(0.5 * globalScale));
    }

    static zoomScale(deltaY: number, gmlRender: GMLRender, nodeManager: NodeManager,globalPoint?:Point) {
        const prevRectBounds: RectNode = gmlRender.getViewPortBounds();

        //缩放
        const delta =2* Math.abs(deltaY) / 100;
        const scale = deltaY > 0 ? (1 - delta) : (1 + delta);

        gmlRender.scale(scale, scale,globalPoint);


        const nextRectBounds: RectNode = gmlRender.getViewPortBounds();

        const rectBounds = GraphicUtils.getBounds([prevRectBounds, nextRectBounds]);


        const ctx = gmlRender.canvas!.getContext("2d")!;

        const {a, b, c, d, e, f} = gmlRender.globalTransform;
        ctx.setTransform(a, b, c, d, e, f);

        ctx.clearRect(rectBounds.minX, rectBounds.minY, rectBounds.maxX - rectBounds.minX, rectBounds.maxY - rectBounds.minY);
        const result = nodeManager.tree.search(rectBounds);

        //整理需要重新绘制的对象
        const graphicSet = new Set<IGraphicElement>();
        for (const treeNode of result) {
            const node = nodeManager.nodeMap.get(treeNode.id);
            if (node) {
                graphicSet.add(node);
            }
            const line = nodeManager.lineMap.get(treeNode.id);
            if (line) {
                graphicSet.add(line);
            }
        }
        const graphicList = [...graphicSet];
        graphicList.sort((a, b) => a.zIndex - b.zIndex);
        const rect = gmlRender.getViewPortBounds();
        for (const graphic of graphicList) {
            if (graphic instanceof OolongText) {
                (graphic as OolongText).drawVisible(rect);
            } else {
                graphic.draw();
            }
        }
        const globalScale = gmlRender.globalTransform.a;
        store.dispatch(updateScale(0.5 * globalScale));
    }

    static zoomRedraw(gmlRender: GMLRender, nodeManager: NodeManager){
        const nextRectBounds: RectNode = gmlRender.getViewPortBounds();

        const rectBounds = nextRectBounds;


        const ctx = gmlRender.canvas!.getContext("2d")!;

        const {a, b, c, d, e, f} = gmlRender.globalTransform;
        ctx.setTransform(a, b, c, d, e, f);

        ctx.clearRect(rectBounds.minX, rectBounds.minY, rectBounds.maxX - rectBounds.minX, rectBounds.maxY - rectBounds.minY);
        const result = nodeManager.tree.search(rectBounds);

        //整理需要重新绘制的对象
        const graphicSet = new Set<IGraphicElement>();
        for (const treeNode of result) {
            const node = nodeManager.nodeMap.get(treeNode.id);
            if (node) {
                graphicSet.add(node);
            }
            const line = nodeManager.lineMap.get(treeNode.id);
            if (line) {
                graphicSet.add(line);
            }
        }
        const graphicList = [...graphicSet];
        graphicList.sort((a, b) => a.zIndex - b.zIndex);
        const rect = gmlRender.getViewPortBounds();
        for (const graphic of graphicList) {
            if (graphic instanceof OolongText) {
                (graphic as OolongText).drawVisible(rect);
            } else {
                graphic.draw();
            }
        }
        const globalScale = gmlRender.globalTransform.a;
        store.dispatch(updateScale(0.5 * globalScale));
    }

}