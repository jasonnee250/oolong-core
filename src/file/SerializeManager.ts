import {Application} from "dahongpao-canvas";
import {DocumentDO} from "@/file/DocumentDO";
import {OolongNodeDO} from "@/file/OolongNodeDO";
import {PageManager} from "@/page/PageManager";
import {OolongLineDO} from "@/file/OolongLineDO.ts";
import {OolongLinkLine} from "@/graphics/OolongLinkLine.ts";
import {DocState} from "@/app/DocState.ts";

export class SerializeManager {

    application: Application;
    pageManager:PageManager;
    docState:DocState;

    constructor(app:Application,pageManager:PageManager,docState:DocState) {
        this.application=app;
        this.pageManager=pageManager;
        this.docState=docState;
    }

    serializeTo():DocumentDO{
        const document=new DocumentDO();
        const nodes:OolongNodeDO[]=[];
        const lines:OolongLineDO[]=[];
        const links:OolongLinkLine[]=[];
        const nodeManager=this.application.nodeManager;
        for(const [_,v] of nodeManager.nodeMap){
            nodes.push(v.serializeTo());
        }
        for(const [_,v] of nodeManager.lineMap){
            lines.push(v.serializeTo());
        }
        for(const [_,v] of nodeManager.oolongLinkMap){
            links.push(v);
        }
        const pages=[]
        for(const page of this.pageManager.pages){
            pages.push(page.serializeTo());
        }

        document.nodes=nodes;
        document.lines=lines;
        document.pages=pages;
        document.links=links;
        document.docSetting=this.docState.serializeTo();
        return document;
    }

    deSerialize(data:string):DocumentDO{
       const documentDO=JSON.parse(data);
       return documentDO;
    }

}