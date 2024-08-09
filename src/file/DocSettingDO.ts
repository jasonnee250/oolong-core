export enum DocMode{
    Document="Document",//文档模式，有主文本
    Board="Board",//无边界画布，没有主文本
    Slide="Slide",//ppt模式，每屏只显示一个page
}

export interface DocSettingDO{
    mode:DocMode;
    backgroundColor:string;

    seq:number;
    savedSeq:number;
}

export function generateDefaultDocSetting(mode:DocMode=DocMode.Document):DocSettingDO{
    return {
        mode,
        backgroundColor:"#EEEEEE",

        seq:0,
        savedSeq:0,
    }
}