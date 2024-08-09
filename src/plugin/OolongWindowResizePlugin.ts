import {GraphicUtils, IApplication, IGraphicElement, IPlugin} from "dahongpao-core";
import {OolongText} from "@/text/base/OolongText.ts";


export class OolongWindowResizePlugin implements IPlugin{
    app: IApplication;

    constructor(app: IApplication) {
        this.app = app;
    }
    start(): void {
        window.addEventListener("resize",this.onResize);
    }
    stop(): void {
        window.removeEventListener("resize",this.onResize);
    }

    onResize=()=>{
        const rectBounds = this.app.gmlRender.getViewPortBounds();


        const ctx = this.app.gmlRender.canvas!.getContext("2d")!;
        ctx!.reset();
        const {a, b, c, d, e, f} = this.app.gmlRender.globalTransform;
        ctx.transform(a, b, c, d, e, f);


        ctx.clearRect(rectBounds.minX, rectBounds.minY, rectBounds.maxX - rectBounds.minX, rectBounds.maxY - rectBounds.minY);
        const result = this.app.nodeManager.tree.search(rectBounds);

        //整理需要重新绘制的对象
        const graphicSet = new Set<IGraphicElement>();
        for (const treeNode of result) {
            const node = this.app.nodeManager.nodeMap.get(treeNode.id);
            if (node) {
                graphicSet.add(node);
            }
            const line = this.app.nodeManager.lineMap.get(treeNode.id);
            if (line) {
                graphicSet.add(line);
            }
        }
        const graphicList = [...graphicSet];
        graphicList.sort((a, b) => a.zIndex - b.zIndex);
        for (const graphic of graphicList) {
            if (graphic instanceof OolongText) {
                (graphic as OolongText).drawVisible(rectBounds);
            } else {
                graphic.draw();
            }
        }
    }

}