import {IActionLog} from "@/action/log/IActionLog";
import {TextCursorPosition} from "@/text/base/TextCursorPosition.ts";
import {ActionType} from "@/action/base/ActionType.ts";

export class MoveCursorTextLog implements IActionLog{
    id:string;
    position:TextCursorPosition;

    reverseLog:MoveCursorTextLog|null=null;
    type=ActionType.MoveCursor;


    constructor(id:string,position:TextCursorPosition) {
        this.id=id;
        this.position=position;
    }

    reverse(): MoveCursorTextLog {
        return this.reverseLog!;
    }

    clone(): MoveCursorTextLog {
        return new MoveCursorTextLog(this.id,{...this.position});
    }

}

