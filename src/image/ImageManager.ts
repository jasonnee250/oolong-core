import RootStore from "@/store/RootStore.ts";

export class ImageManager {
   constructor() {

   }

   uploadBlobImg(nodeId:string,blobImg:Blob){

       const docId=RootStore.getState().docState.docInfo.docId;

       return new Promise<string>((resolve, reject)=>{
           const blobUrl=URL.createObjectURL(blobImg);
           resolve(blobUrl);

       });

   }

}