import {IndexDBManager} from "@/offline/IndexDBManager";
import {SerializeManager} from "@/file/SerializeManager.ts";
import {DocState} from "@/app/DocState.ts";

export class OfflineManager {

    indexDBManager:IndexDBManager;
    serializeManager:SerializeManager;
    timer:any=null;

    constructor(serializeManager:SerializeManager) {
        this.indexDBManager=new IndexDBManager();
        this.serializeManager=serializeManager;
    }

    start():void{
        this.indexDBManager.init();
        this.timer=setInterval(()=>{
            const docInf=this.serializeManager.serializeTo();
            this.indexDBManager.addDocInfo(docInf,this.serializeManager.docState);
        },60*1000);
    }

    restore(){
        return this.indexDBManager.restore();
    }

    stop():void{
        if(this.timer!==null){
            clearInterval(this.timer);
        }
    }




    
}