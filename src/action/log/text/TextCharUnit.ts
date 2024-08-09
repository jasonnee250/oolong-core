export class TextCharUnit{
    char:string;//字符
    color?:string;//颜色
    bold?:boolean;//是否加粗
    italic?:boolean;//是否斜体

    constructor(char:string) {
        this.char=char;
    }

}