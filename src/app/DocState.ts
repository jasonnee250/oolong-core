import {DocMode, DocSettingDO} from "@/file/DocSettingDO.ts";

export class DocState{
    seq:number=0;
    savedSeq:number=-1;

    /**
     * 文档基础设置信息
     */
    mode:DocMode=DocMode.Board;
    backgroundColor:string="#EEEEEE";

    load(docSetting:DocSettingDO):void{
        this.mode=docSetting.mode||DocMode.Document;
        this.backgroundColor=docSetting.backgroundColor;
        this.seq=docSetting.seq;
        this.savedSeq=docSetting.savedSeq;
    }

    serializeTo():DocSettingDO{
        return {
            mode:this.mode,
            backgroundColor:this.backgroundColor,
            seq:this.seq,
            savedSeq:this.savedSeq,
        }
    }
}