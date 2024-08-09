
export class LinkNode<T>{
    prev:LinkNode<T>|null=null;
    next:LinkNode<T>|null=null;
    data:T|null=null;

    constructor(data:T|null) {
        this.data=data;
    }

    breakOff():void{
        this.prev=null;
        this.next=null;
    }
    toString():string{
        if(this.data){
            return this.data.toString();
        }
        return '';
    }

    /**
     * insert add
     * A->B
     * A->C->B
     * @param node
     */
    add(node:LinkNode<T>):void{
        const next=this.next;
        this.next=node;
        node.prev=this;
        node.next=next;
        if(next){
            next.prev=node;
        }
    }

    /**
     * A->B
     * A->B->C
     * @param node
     */
    pushAdd(node:LinkNode<T>):void{
        this.next=node;
        node.prev=this;
    }

    removeSelf():void{
        const next=this.next;
        const prev=this.prev;
        this.next=null;
        this.prev=null;
        next!.prev=prev;
        prev!.next=next;
    }

    getIndex():number{
        //@typescript-eslint/no-this-alias
        let iter=this.prev;
        let index=0;
        while (iter && iter.data){
            index++;
            iter=iter.prev;
        }
        return index;
    }

    static generateLink<T>():LinkNode<T>{
        const head=new LinkNode<T>(null);
        const tail=new LinkNode<T>(null);
        head.add(tail);
        return head;
    }
}


