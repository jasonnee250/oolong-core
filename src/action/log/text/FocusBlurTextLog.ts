import {IActionLog} from "@/action/log/IActionLog";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {ActionType} from "@/action/base/ActionType.ts";

export enum FocusTextType{
    Editing="Editing",
    Selection="Selection",
    Blur="Blur",
}
export class FocusTextLog implements IActionLog {

    id?: string;
    textCursorPosition?:TextCursorPosition;
    endTextCursorPosition?:TextCursorPosition;
    focusType:FocusTextType;
    reverseLog: FocusTextLog | null = null;
    type=ActionType.FocusText;


    constructor(id?: string,focusType:FocusTextType, textCursorPosition?:TextCursorPosition,
                endTextCursorPosition?:TextCursorPosition) {
        this.id = id;
        this.textCursorPosition = textCursorPosition;
        this.endTextCursorPosition=endTextCursorPosition;
        this.focusType=focusType;
    }

    clone(): FocusTextLog {
        const textCursor=this.textCursorPosition?this.textCursorPosition.clone():undefined;
        const endTextCursor=this.endTextCursorPosition?this.endTextCursorPosition.clone():undefined;
        return new FocusTextLog(this.id,this.focusType,textCursor,endTextCursor);
    }

    reverse(): FocusTextLog {
        return this.reverseLog!;
    }
}


export class BlurTextLog implements IActionLog {
    focusTextLog: FocusTextLog | null = null;
    type=ActionType.BlurText;


    clone(): BlurTextLog {
        return new BlurTextLog();
    }

    reverse(): FocusTextLog {
        return this.focusTextLog!;
    }
}
