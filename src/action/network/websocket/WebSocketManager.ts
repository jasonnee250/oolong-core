import {ConnectState} from "@/action/network/websocket/ConnectState";
// import {io} from "socket.io-client";

export class WebSocketManager {
    socket: WebSocket|null=null;

    state:ConnectState=ConnectState.Unknown;

    constructor() {

    }

    init(url: string):void{
        console.log("==========连接 ws============",url)
        this.socket=new WebSocket(url);
        this.socket.onopen=this.onOpen;
        this.socket.onclose=this.onClose;
        this.socket.onerror=this.onError;
        this.socket.onmessage =this.onMessage;
    }

    sendMessage(data:any){
        if(!this.socket){
            return;
        }
        if(this.state!==ConnectState.Succ){
            console.error("websocket网络连接异常，无法发送消息!");
            return;
        }
        this.socket.send(data);

    }

    onOpen = () => {
        console.log("====== ws 连接成功 ==========")
        this.state=ConnectState.Succ;
    }

    onError = () => {

    }

    onMessage = () => {

    }

    onClose=()=>{

    }


}