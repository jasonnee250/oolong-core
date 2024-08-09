import {IActionLog} from "@/action/log/IActionLog";
import {ActionType} from "@/action/base/ActionType.ts";
import {TextCharUnit} from "@/action/log/text/TextCharUnit.ts";

export class EditTextLog implements IActionLog{
    editText:TextCharUnit[];
    deleteTextLog:DeleteTextLog|null=null;
    type=ActionType.EditText;

    constructor(editText:string) {
        const res:TextCharUnit[]=[];
        for(const char of editText){
            res.push(new TextCharUnit(char));
        }
        this.editText=res;
    }

    static generateFrom(editText:TextCharUnit[]):EditTextLog{
        const textLog=new EditTextLog("");
        textLog.editText=editText;
        return textLog;
    }

    reverse(): DeleteTextLog {
        if(!this.deleteTextLog){
            throw new Error("数据错误！");
        }
        return this.deleteTextLog;
    }

    clone(): EditTextLog {
        return EditTextLog.generateFrom(this.editText);
    }
}

export class DeleteTextLog implements IActionLog{
    deleteNum:number;
    editTextLog:EditTextLog|null=null;

    type=ActionType.DeleteText;

    constructor(deleteNum:number=1) {
        this.deleteNum=deleteNum;
    }

    reverse(): EditTextLog {
        if(!this.editTextLog){
            throw new Error("数据错误！");
        }
        return this.editTextLog;
    }

    clone(): DeleteTextLog {
        return new DeleteTextLog(this.deleteNum);
    }
}