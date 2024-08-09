import {OolongNodeDO} from "@/file/OolongNodeDO";
import {PageDO} from "@/file/PageDO";
import {OolongLineDO} from "@/file/OolongLineDO.ts";
import {OolongLinkLine} from "@/graphics/OolongLinkLine.ts";
import {DocMode, DocSettingDO, generateDefaultDocSetting} from "@/file/DocSettingDO.ts";

/**
 * 文档序列化对象
 */
export class DocumentDO {
    /**
     * 节点对象
     */
    nodes:OolongNodeDO[]=[];
    /**
     * 连线对下
     */
    lines:OolongLineDO[]=[];
    /**
     * 连接信息
     */
    links:OolongLinkLine[]=[];
    /**
     * 页面信息
     */
    pages:PageDO[]=[];
    /**
     * 全局页面设置
     */
    docSetting:DocSettingDO;
}

export function generateEmptyDocumentDO(docMode:DocMode):DocumentDO{
    const doc=new DocumentDO();
    doc.docSetting=generateDefaultDocSetting(docMode);
    return doc;
}