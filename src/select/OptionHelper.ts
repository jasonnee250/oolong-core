import {IGraphicElement} from "dahongpao-core";

export class OptionHelper {

    isWorking:boolean=false;
    idList:string=[];
    originX:number=0;
    originY:number=0;

    startWorking(idList:string[],x:number,y:number){
        this.idList=idList;
        this.originX=x;
        this.originY=y;
        this.isWorking=true;
    }

    selectChange(nodes:Set<IGraphicElement>){
        if(!this.isWorking){
            return;
        }
        if(nodes.size!==this.idList.length){
            this.stopWork();
        }
        const idSet=new Set(this.idList);
        for(const node of nodes){
            if(!idSet.has(node.id)){
                this.stopWork();
            }
            idSet.delete(node.id);
        }
        if(idSet.size!==0){
            this.stopWork();
        }
    }

    stopWork():void{
        this.idList=[];
        this.isWorking=false;
    }


}