import {DocumentDO} from "@/file/DocumentDO";
import RootStore from "@/store/RootStore";
import {OfflineDocData} from "@/offline/OfflineDocData.ts";
import {DocState} from "@/app/DocState.ts";

export const dbName="oolong-offline";
export const docContentTable="doc_content";

export const primaryKey="docId";
export class IndexDBManager {

    dbName="oolong-offline"
    dbVersion=1;
    db:any=null;

    init():void{
        const request=this.open();
        this.onError(request);
        this.onSuccess(request);
        this.onUpgradeneeded(request);
    }

    restore():Promise<OfflineDocData|null>{
        const customObjStore=this.db.transaction(docContentTable,"readwrite")
            .objectStore(docContentTable);
        const docId=RootStore.getState().docState.docInfo.docId;
        const r=customObjStore.get(docId);
        return new Promise((resolve, reject)=>{
            r.onsuccess=(event)=>{
                const data=event.target.result as OfflineDocData|undefined;
                if(data){
                    resolve(data);
                }else{
                    resolve(null);
                }
            }
            r.onerror=(event)=>{
                reject(event);
            }
        })
    }

    deleteDocInfo():void{
        const customObjStore=this.db.transaction(docContentTable,"readwrite")
            .objectStore(docContentTable);
        const docId=RootStore.getState().docState.docInfo.docId;
        const requestUpdate=customObjStore.delete(docId);
        requestUpdate.onerror=()=>{
            console.error("出现错误");
        }
        requestUpdate.onsuccess=()=>{
            console.log("删除成功");
        }
    }

    addDocInfo(doc:DocumentDO,docState:DocState):void{
        if(docState.savedSeq==docState.seq){
            console.log("离线数据库版本较新，不需要写入保存");
            return;
        }
        const customObjStore=this.db.transaction(docContentTable,"readwrite")
            .objectStore(docContentTable);
        const docId=RootStore.getState().docState.docInfo.docId;

        const r=customObjStore.get(docId);
        r.onsuccess=(event)=>{
            const data=event.target.result as OfflineDocData|undefined;
            const now=new Date();
            if(data){
                if(data.docInfo.docSetting.seq>=docState.seq){
                    console.log("离线数据库版本较新，不需要写入保存");
                    return;
                }
                data.docInfo=doc;
                data.updateTime=now;
                const requestUpdate=customObjStore.put(data);
                requestUpdate.onerror=()=>{
                    console.error("出现错误");
                }
                requestUpdate.onsuccess=()=>{
                    docState.savedSeq=docState.seq;
                    console.log("更新成功");
                }
            }else{
                const offlineDoc:OfflineDocData={
                    docId,
                    docInfo:doc,
                    updateTime:now,
                }
                const requestAdd=customObjStore.add(offlineDoc);
                requestAdd.onerror=()=>{
                    console.error("出现错误");
                }
                requestAdd.onsuccess=()=>{
                    console.log("更新成功");
                }
            }

        }
    }

    open(){
        const request=window.indexedDB.open(this.dbName,this.dbVersion);
        return request;
    }

    onError(request:IDBOpenDBRequest){
        request.onerror=(event)=>{
            console.error("index db 无法启用. error msg:",event.target.errorCode);
        }
    }

    onSuccess(request:IDBOpenDBRequest){
        request.onsuccess=(event)=>{
            console.log("index db离线数据库成功创建");
            const db=event.target.result;
            this.db=db;
        }
    }

    onUpgradeneeded(request:IDBOpenDBRequest){
        request.onupgradeneeded=(event)=>{
            console.log("index db onUpgradeneeded");
            const db=event.target.result;
            const oolongDocStore=db.createObjectStore(docContentTable,{keyPath:primaryKey});
            this.db=db;
        }

    }

}