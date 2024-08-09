import {CursorStyle} from "@/cursor/CursorStyle.ts";

export class CursorManager {

    currentCursor:string="default";

    // nextCursor:string="default";

    constructor() {
        // this.tickerRun();
    }

    setCursor(cursor:string):void{
        if(this.currentCursor!==cursor){
            document.body.style.cursor=CursorStyle[cursor]||cursor;
            this.currentCursor=cursor;
        }
    }


    // tickerRun=()=>{
    //     if(this.nextCursor!==this.currentCursor){
    //         document.body.style.cursor=CursorStyle[this.nextCursor]||this.nextCursor;
    //         this.currentCursor=this.nextCursor;
    //     }
    //     requestAnimationFrame(this.tickerRun);
    // }

}