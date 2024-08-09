import {GMLRender, IGraphicElement} from "dahongpao-core";
import {NodeManager} from "dahongpao-canvas";
import {AuxiliaryManager} from "@/auxiliary/AuxiliaryManager.ts";

export class RenderManager {

    gmlRender: GMLRender;
    nodeManager: NodeManager;
    renderElements: Set<IGraphicElement>;
    auxiliaryDraw:boolean=false;
    auxiliaryManager:AuxiliaryManager;

    constructor(gmlRender: GMLRender, nodeManager: NodeManager,auxiliaryManager:AuxiliaryManager) {
        this.gmlRender = gmlRender;
        this.nodeManager = nodeManager;
        this.renderElements = new Set<IGraphicElement>();
        this.auxiliaryManager=auxiliaryManager;
    }

    start(): void {
        this.tickerRun();
    }

    addDrawNode(node: IGraphicElement): void {
        this.renderElements.add(node);
    }

    addAuxiliaryDrawTask():void{
        this.auxiliaryDraw=true;
    }

    tickerRun = () => {
        //content层绘制
        if (this.renderElements.size !== 0) {
            const bounds = this.gmlRender.getViewPortBounds();
            const result = this.nodeManager.tree.search(bounds);
            const graphicSet = new Set<IGraphicElement>();
            for (const treeNode of result) {
                const node = this.nodeManager.nodeMap.get(treeNode.id);
                if (node) {
                    graphicSet.add(node);
                }
                const line = this.nodeManager.lineMap.get(treeNode.id);
                if (line) {
                    graphicSet.add(line);
                }
            }
            const graphicList = [...graphicSet];
            graphicList.sort((a, b) => a.zIndex - b.zIndex);
            this.gmlRender.dirtyDraw(bounds, graphicList);
            this.renderElements.clear();
        }
        //辅助层绘制
        if(this.auxiliaryDraw){
            this.auxiliaryManager.redraw();
            this.auxiliaryDraw=false;
        }
        requestAnimationFrame(this.tickerRun);
    }

}