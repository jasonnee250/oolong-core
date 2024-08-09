import {GraphicUtils, Point} from "dahongpao-core";
import {OolongLine} from "@/text/base/OolongLine.ts";
import {Rect} from "@/text/base/Rect.ts";
import {LinkNode} from "@/text/base/OolongLink.ts";
import {OolongCharDO} from "@/file/text/OolongCharDO.ts";
import {TextCharUnit} from "@/action/log/text/TextCharUnit.ts";

export interface CharInfo {
    x: number,
    y: number,
    rectY:number,
    width:number,
    height:number,
    text: string,
    color?: string,
    bold?: boolean,
    italic?: boolean,
    backgroundColor?: string,
    strikeThrough?:boolean,
    underline?:boolean,
}
export class OolongCharacter {
    charText: string;
    //相对于行的位置
    x: number;
    y: number;
    width: number;
    height: number;
    index: number = 0;
    //字符颜色
    color?: string;
    backgroundColor?: string;
    //是否加粗
    bold?: boolean;
    //是否斜体
    italic?: boolean;
    //删除线
    strikeThrough?:boolean;
    //下划线
    underline?:boolean;

    linePtr: LinkNode<OolongLine> | null = null;

    linkPtr: LinkNode<OolongCharacter> | null = null;

    //扩展一些混排属性

    constructor(text: string, x: number, y: number, width: number, height: number) {
        this.charText = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    initChar(linePtr: LinkNode<OolongLine>, linkPtr: LinkNode<OolongCharacter>): void {
        this.linePtr = linePtr;
        this.linkPtr = linkPtr;
    }

    contains(point: Point): boolean {
        return GraphicUtils.rectContains2(point, {
                minX: this.x, maxX: this.x + this.width,
                minY: this.y, maxY: this.y + this.height
            }
        )
    }

    toString(): string {
        return this.charText;
    }

    getRect(): Rect {
        const {x, y, width, height} = this;
        return {
            x,
            y,
            width,
            height,
        }
    }

    serializeTo(): OolongCharDO {
        return {
            x: this.x,
            y: this.y,
            index: this.index,
            width: this.width,
            height: this.height,
            charText: this.charText,
            color: this.color,
            bold:this.bold,
            italic:this.italic,
            backgroundColor: this.color,
            strikeThrough:this.strikeThrough,
            underline:this.underline,
        }
    }

    serializeToEditLog(): TextCharUnit {
        return {
            char: this.charText,
            color: this.color,
            bold:this.bold,
            italic:this.italic,
        }
    }

    static load(charDO: OolongCharDO): OolongCharacter {
        const {x, y, width, height, charText, index, color,
            backgroundColor,bold,italic,strikeThrough,underline} = charDO;
        const character = new OolongCharacter(charText, x, y, width, height);
        character.index = index;
        character.color = color;
        character.backgroundColor = backgroundColor;
        character.bold=bold;
        character.italic=italic;
        character.strikeThrough=strikeThrough;
        character.underline=underline;
        return character;
    }


}