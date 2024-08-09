import {OolongParagraphDO} from "@/file/text/OolongParagraphDO";
import {OolongNodeDO} from "@/file/OolongNodeDO";

export enum PasteType{
    Nodes="Nodes",
    TextContent="TextContent",
}
export interface PasteData {
    pasteType:PasteType;
    paragraphs?:OolongParagraphDO[];
    nodes?:OolongNodeDO[];
}