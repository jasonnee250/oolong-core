
export enum PageEnum{
    A6="A6",
    A5="A5",
    A4="A4",
    A3="A3",
    A2="A2",
    A1="A1",
    B3="B3",
    B4="B4",
}

export const A4PageDefine={type:PageEnum.A4,width:595,height:842};

export interface PageDefine{
    type:PageEnum;
    width:number;
    height:number;
}


export const PageSettingConfig:PageDefine[] = [
    {type:PageEnum.A6,width:298,height:420},
    {type:PageEnum.A5,width:420,height:595},
    A4PageDefine,
    {type:PageEnum.A3,width:842,height:1191},
    {type:PageEnum.A2,width:1191,height:1684},
    {type:PageEnum.A1,width:1684,height:2384},
    {type:PageEnum.B4,width:709,height:1001},
    {type:PageEnum.B3,width:1001,height:1417},
]