import {IActionLog} from "@/action/log/IActionLog";
import {LinkNode} from "@/text/base/OolongLink";
import {WebSocketManager} from "@/action/network/websocket/WebSocketManager.ts";
import {ActionLogGroup} from "@/action/log/ActionLogGroup.ts";

export class NetworkManager {

    /**
     * log队列
     */
    head: LinkNode<IActionLog>;
    tail: LinkNode<IActionLog>;

    batch:number=20;

    /**
     * websocket连接
     */
    webSocketManager:WebSocketManager;

    constructor() {
        this.head = LinkNode.generateLink();
        this.webSocketManager=new WebSocketManager();
        this.tail = this.head.next!;
        this.tickerRun();
    }

    init():void{
        this.webSocketManager.init("ws://localhost:8080/channel/msg");
    }

    enqueue(log: IActionLog): void {
        const linkedLog = new LinkNode(log);
        this.tail.prev!.add(linkedLog);
    }

    enqueueGroup(group: ActionLogGroup): void {
        for(const actionLog of group.actionLogs){
            this.enqueue(actionLog.clone());
        }
    }

    dequeue(): IActionLog | null {
        const linkedLog = this.head.next!;
        if (linkedLog === this.tail) {
            return null;
        }
        this.head.next = linkedLog.next;
        linkedLog.next!.prev = this.head;
        linkedLog.next = null;
        linkedLog.prev = null;
        return linkedLog.data!;
    }

    tickerRun=()=>{
        const actions=[];
        for(let i=0;i<this.batch;i++){
            const actionLog=this.dequeue();
            if(!actionLog){
                break;
            }
            actions.push(actionLog);
        }
        if(actions.length>0){
            this.webSocketManager.sendMessage(JSON.stringify(actions));
        }
        requestAnimationFrame(this.tickerRun);
    }
}