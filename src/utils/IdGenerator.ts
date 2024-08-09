import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {OolongLineDO} from "@/file/OolongLineDO.ts";
import md5 from 'crypto-js/md5';

export class IdGenerator {

    static prefix = '001';

    /**
     * id，number
     */
    static map: Map<string, number> = new Map<string, number>();
    /**
     * z-index记录
     */
    static zIndex: number = 0;

    /**
     * a001:1
     * @param type
     */
    static genId(type: OolongNodeType|string): string {
        const count = (this.map.get(type) || 0) + 1;
        this.map.set(type, count);
        return this.type2NodePrefix(type) + this.prefix + ':' + count;
    }

    static genImgFileName(docId:string,nodeId: string): string {
        const fileName="img:"+docId+"|"+nodeId;
        return md5(fileName).toString();
    }

    static loadNode(node: OolongNodeDO | OolongLineDO): void {
        this.loadNodeId(node.id);
        this.recordZIndex(node.zIndex);
    }

    static loadNodeId(nodeId: string) {
        const type = this.nodePrefix2Type(nodeId[0]);
        const res = nodeId.split(':');
        try {
            const count = parseInt(res[1]);
            this.map.set(type, count);
        } catch (e) {
            console.error('id错误', e);
        }
    }

    static recordZIndex(zIndex: number): void {
        if (this.zIndex < zIndex) {
            this.zIndex = zIndex;
        }
    }

    static genZIndex(): number {
        this.zIndex++;
        return this.zIndex;
    }

    static type2NodePrefix(type: OolongNodeType | string): string {
        switch (type) {
            case OolongNodeType.Shape:
                return 'a';
            case OolongNodeType.Text:
                return 'b';
            case OolongNodeType.Line:
                return 'c';
            case OolongNodeType.SVG:
                return 'd';
            case OolongNodeType.IMG:
                return 'e';
            case 'page':
                return 'p';
            default:
                return 'a';
        }
    }

    static nodePrefix2Type(nodePrefix: string): OolongNodeType | string {
        if (nodePrefix === 'a') {
            return OolongNodeType.Shape;
        }
        if (nodePrefix === 'b') {
            return OolongNodeType.Text;
        }
        if (nodePrefix === 'c') {
            return OolongNodeType.Line;
        }
        if (nodePrefix === 'd') {
            return OolongNodeType.SVG;
        }
        if (nodePrefix === 'e') {
            return OolongNodeType.IMG;
        }
        if (nodePrefix === 'p') {
            return 'page';
        }
        return OolongNodeType.Shape;
    }

}