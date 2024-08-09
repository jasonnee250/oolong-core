import {LinkNode} from "@/text/base/OolongLink.ts";
import {OolongParagraph} from "@/text/base/OolongParagraph.ts";
import {OolongLine} from "@/text/base/OolongLine.ts";
import {OolongCharacter} from "@/text/base/OolongCharacter.ts";

export class TextCursorPosition {
    paragraphIndex: number;
    lineIndex: number;
    charIndex: number;

    constructor(paragraphIndex: number, lineIndex: number, charIndex: number) {
        this.paragraphIndex = paragraphIndex;
        this.lineIndex = lineIndex;
        this.charIndex = charIndex;
    }

    static load(paragraphPtr: LinkNode<OolongParagraph>,
                linePtr: LinkNode<OolongLine>,
                charPtr: LinkNode<OolongCharacter>): TextCursorPosition {
        let charIndex = -1;
        if (charPtr && charPtr.data) {
            charIndex = charPtr.data.index;
        }
        return {
            paragraphIndex: paragraphPtr!.data!.index,
            lineIndex: linePtr!.data!.index,
            charIndex,
        }
    }

    clone(): TextCursorPosition {
        return new TextCursorPosition(this.paragraphIndex, this.lineIndex, this.charIndex);
    }

    equal(other: TextCursorPosition): boolean {
        return this.paragraphIndex === other.paragraphIndex
            && this.lineIndex === other.lineIndex
            && this.charIndex === other.charIndex;
    }
}