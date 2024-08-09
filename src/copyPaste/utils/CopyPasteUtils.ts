export class CopyPasteUtils {

    static oolongLeft="<<--oolong--";
    static oolongRight="--oolong-->>";

    static encode(data:string){
        const encode=encodeURI(data);
        const base64=btoa(encode);
        return `<html>
                    <head><meta charset="utf-8"></head>
                    <body>
                        <div style="white-space: pre-wrap" data-info=${CopyPasteUtils.oolongLeft}${base64}${CopyPasteUtils.oolongRight}/>
                    </body>
                </html>`
    }

    static decode(textData:string){
        const start=textData.indexOf(this.oolongLeft);
        const end=textData.indexOf(this.oolongRight);
        if(start<0||end<0||start===end){
            return null;
        }
        const base64=textData.slice(start+this.oolongLeft.length,end);
        const decode=atob(base64);
        const res=decodeURI(decode);
        return res;
    }
}