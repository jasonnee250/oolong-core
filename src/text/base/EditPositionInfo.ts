import {LinkNode} from "@/text/base/OolongLink.ts";
import {OolongParagraph} from "@/text/base/OolongParagraph.ts";
import {OolongLine} from "@/text/base/OolongLine.ts";
import {OolongCharacter} from "@/text/base/OolongCharacter.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";

export class EditPositionInfo {
    paragraphPtr: LinkNode<OolongParagraph>|null=null;
    linePtr: LinkNode<OolongLine>|null=null;
    charPtr: LinkNode<OolongCharacter>|null=null;

    constructor(paragraphPtr: LinkNode<OolongParagraph>|null,
                linePtr: LinkNode<OolongLine>|null=null,
                charPtr: LinkNode<OolongCharacter>|null) {
        this.paragraphPtr = paragraphPtr;
        this.linePtr = linePtr;
        this.charPtr = charPtr;
    }

    compare(other:EditPositionInfo):boolean{
        if(this.paragraphPtr!.data!.index>other.paragraphPtr!.data!.index){
            return true;
        }
        if(this.paragraphPtr!.data!.index<other.paragraphPtr!.data!.index){
            return false;
        }
        if(this.paragraphPtr!.data!.index === other.paragraphPtr!.data!.index){
            if(this.linePtr!.data!.index >other.linePtr!.data!.index){
                return true;
            }
            if(this.linePtr!.data!.index <other.linePtr!.data!.index){
                return false;
            }
            if(this.linePtr!.data!.index === other.linePtr!.data!.index){
                const charIndex=this.charPtr!.data?this.charPtr!.data.index:-1;
                const otherCharIndex=other.charPtr!.data?other.charPtr!.data.index:-1;

                if(charIndex>otherCharIndex){
                    return true;
                }
                if(charIndex<otherCharIndex){
                    return false;
                }
                if(charIndex===otherCharIndex){
                    return false;
                }
            }
            return false;
        }
        return false;
    }

    equal(other:EditPositionInfo):boolean{
        return this.paragraphPtr===other.paragraphPtr && this.linePtr===other.linePtr && this.charPtr===other.charPtr;
    }


    toString(): string {
        return '';
    }

    serializeTo():TextCursorPosition{
        let charIndex=-1;
        if(this.charPtr && this.charPtr.data){
            charIndex=this.charPtr.data.index;
        }
        return new TextCursorPosition(
            this.paragraphPtr!.data!.index,
            this.linePtr!.data!.index,
            charIndex);
    }
}
