import {Application, EventContext, PointerEventPlugin, WheelEventPlugin, WindowResizePlugin} from "dahongpao-canvas";
import {AppConfig} from "@/app/AppConfig";
import {ToolManager} from "@/tool/ToolManager.ts";
import {OolongEventContext} from "@/interact/OolongEventContext.ts";
import {InputEventPlugin} from "@/plugin/InputEventPlugin.ts";
import {InputManager} from "@/text/input/InputManager.ts";
import {KeyEventPlugin} from "@/plugin/KeyEventPlugin.ts";
import {OolongWheelEventPlugin} from "@/plugin/OolongWheelEventPlugin.ts";
import {PageManager} from "@/page/PageManager.ts";
import {ImageManager} from "@/image/ImageManager.ts";
import {OolongText} from "@/text/base/OolongText.ts";
import {paddingLR,} from "@/page/PageConfig.ts";
import {MainTextId} from "@/text/config/OolongTextConstants.ts";
import {CopyPastePlugin} from "@/plugin/CopyPastePlugin.ts";
import {OolongRender} from "@/app/OolongRender.ts";
import {SerializeManager} from "@/file/SerializeManager.ts";
import {DocumentDO} from "@/file/DocumentDO.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {ActionManager} from "@/action/ActionManager.ts";
import {AuxiliaryManager} from "@/auxiliary/AuxiliaryManager.ts";
import {OolongInteractiveManager} from "@/interact/OolongInteractiveManager.ts";
import {IdGenerator} from "@/utils/IdGenerator.ts";
import {OolongWindowResizePlugin} from "@/plugin/OolongWindowResizePlugin.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongNodeManager} from "@/app/OolongNodeManager.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongLinkInfo, OolongLinkLine} from "@/graphics/OolongLinkLine.ts";
import {OolongSVGNode} from "@/graphics/OolongSVGNode.ts";
import {IGraphicElement} from "dahongpao-core";
import {OolongImgNode} from "@/graphics/OolongImgNode.ts";
import {OfflineManager} from "@/offline/OfflineManager.ts";
import {DocState} from "@/app/DocState.ts";
import {PageDefine} from "@/component/rightTopTool/pageSetting/PageSettingConfig.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {generateDefaultDocSetting} from "@/file/DocSettingDO.ts";

export class OolongApp {

    pageManager: PageManager;
    inputManager: InputManager;
    imageManager: ImageManager;
    toolManager: ToolManager;
    application: Application;
    auxiliaryApplication: Application;
    serializeManager: SerializeManager;
    actionManager: ActionManager;
    auxiliaryManager: AuxiliaryManager;
    offlineManager: OfflineManager;
    docState: DocState;

    constructor() {
        this.docState = new DocState();
        this.application = new Application();
        this.application.gmlRender = new OolongRender();
        this.application.nodeManager = new OolongNodeManager();
        this.pageManager = new PageManager(this.docState);
        this.imageManager = new ImageManager();
        this.inputManager = new InputManager(this.application.gmlRender, this.application.nodeManager);
        this.toolManager = new ToolManager(this.application.nodeManager, this.inputManager);
        this.auxiliaryApplication = new Application();
        this.auxiliaryManager = new AuxiliaryManager(this.auxiliaryApplication.gmlRender, this.inputManager);
        this.actionManager = new ActionManager(this.application.nodeManager, this.inputManager,
            this.pageManager, this.application.gmlRender, this.auxiliaryManager, this.imageManager, this.toolManager, this.docState);
        const config = new AppConfig();
        //auxiliary ctx
        const auxiliaryCtx: EventContext = {
            nodeManager: this.auxiliaryApplication.nodeManager,
            gmlRender: this.auxiliaryApplication.gmlRender,
            detectors: new Map<any, any>(),
            lastInteractiveEvent: null,
            reset() {
            },
        }

        const ctx: OolongEventContext = new OolongEventContext(
            this.application.nodeManager,
            this.application.gmlRender,
            config.detectors,
            this.toolManager,
            this.inputManager,
            this.imageManager,
            this.pageManager,
            auxiliaryCtx,
            this.actionManager,
            this.auxiliaryManager,
            this.docState);
        const eventPlugin = new PointerEventPlugin(ctx, config);
        eventPlugin.interactiveManager = new OolongInteractiveManager(config);
        const wheelPlugin = new OolongWheelEventPlugin(ctx);
        const inputPlugin = new InputEventPlugin(ctx);
        const hotKeyPlugin = new KeyEventPlugin(ctx);
        const copyPastePlugin = new CopyPastePlugin(ctx);
        const resizePlugin = new OolongWindowResizePlugin(this.application);
        this.application.registerPlugin(eventPlugin);
        this.application.registerPlugin(wheelPlugin);
        this.application.registerPlugin(inputPlugin);
        this.application.registerPlugin(hotKeyPlugin);
        this.application.registerPlugin(copyPastePlugin);
        this.application.registerPlugin(resizePlugin);

        //auxiliary application add
        const wheelPlugin3 = new WheelEventPlugin(auxiliaryCtx);
        const resizePlugin3 = new WindowResizePlugin(this.auxiliaryApplication);
        this.auxiliaryApplication.registerPlugin(wheelPlugin3);
        this.application.registerPlugin(resizePlugin3);
        this.serializeManager = new SerializeManager(this.application, this.pageManager, this.docState);
        this.offlineManager = new OfflineManager(this.serializeManager);

    }

    start(): void {
        this.application.start();
        this.pageManager.start();
        this.auxiliaryApplication.start();
        this.actionManager.start();
        this.offlineManager.start();
        this.auxiliaryManager.start();
        //这部分逻辑需 迁移

    }


    stop(): void {
        this.application.stop();
        this.pageManager.stop();
        this.auxiliaryApplication.stop();
    }

    load(dataString:string):number{
        const data=this.serializeManager.deSerialize(dataString);
        return this.loadDocumentDO(data);
    }

    loadDocumentDO(documentDO:DocumentDO):number{
        const docSetting=documentDO.docSetting!==undefined?documentDO.docSetting:generateDefaultDocSetting();
        this.docState.load(docSetting);

        this.initData(documentDO).then(graphics=>{
            this.drawGraphicElement(graphics);
        }).catch((e)=>console.error("初始化过程中出现错误;",e));
        return this.docState.seq;
    }

    async initData(data: DocumentDO) {
        this.pageManager.reset();
        this.application.nodeManager.clear();
        this.application.gmlRender.reset();
        /**
         * 先加载页面信息
         */
        this.pageManager.load(data.pages);

        const glCtx = this.application.gmlRender.canvas!.getContext('2d')!;
        const graphicElement = [];
        for (const nodeDO of data.nodes) {
            //id记录
            IdGenerator.loadNode(nodeDO);
            if (nodeDO.type === OolongNodeType.Text) {
                const oolongText = OolongText.load(nodeDO, glCtx, this.pageManager);
                graphicElement.push(oolongText);
            } else if (nodeDO.type === OolongNodeType.Shape) {
                const oolongNode = OolongNode.load(nodeDO, glCtx, this.pageManager);
                graphicElement.push(oolongNode);
            } else if (nodeDO.type === OolongNodeType.SVG) {
                const oolongNode = OolongSVGNode.load(nodeDO, glCtx, this.pageManager);
                graphicElement.push(oolongNode);
                await oolongNode.generateTexture();
            } else if (nodeDO.type === OolongNodeType.IMG) {
                const oolongNode = OolongImgNode.load(nodeDO, glCtx, this.pageManager);
                graphicElement.push(oolongNode);
                await oolongNode.loadImg();
            }
        }
        for (const lineDO of data.lines) {
            IdGenerator.loadNode(lineDO);
            if (lineDO.type === OolongNodeType.Line) {
                const oolongLine = OolongLine.load(lineDO, glCtx, this.pageManager);
                graphicElement.push(oolongLine);
            }
        }
        for (const linkLine of data.links) {
            const link = new OolongLinkLine(linkLine.id);
            if (linkLine.start) {
                link.start = new OolongLinkInfo(linkLine.start.id, linkLine.start.connectPoint);
            }
            if (linkLine.end) {
                link.end = new OolongLinkInfo(linkLine.end.id, linkLine.end.connectPoint);
            }
            this.application.nodeManager.addUpdateLinkLineInfo(link);
        }
        graphicElement.sort((a, b) => a.zIndex - b.zIndex);

        return graphicElement;

    }

    drawGraphicElement(graphicElement: IGraphicElement[]) {
        const viewBounds = this.application.gmlRender.getViewPortBounds();
        for (const g of graphicElement) {
            if (g instanceof OolongText) {
                this.application.nodeManager.addNode(g);
                g.drawVisible(viewBounds);
            } else if (g instanceof OolongNode) {
                this.application.nodeManager.addNode(g);
                g.draw();
            } else if (g instanceof OolongLine) {
                this.application.nodeManager.addLine(g);
                g.draw();
            }
        }
    }
}