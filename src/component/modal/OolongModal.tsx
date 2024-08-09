import {Button, Modal} from "antd";
import {OfflineDocData} from "@/offline/OfflineDocData.ts";
import {OolongApp} from "@/app/OolongApp.ts";

interface IProps{
    oolongApp:OolongApp;
    show:boolean;
    setShow:any;
    offlineData:OfflineDocData;
    seq:number;
}
export const OolongModal = ({show,setShow,offlineData,seq,oolongApp}:IProps) => {

    const close=()=>{
        setShow(false);
    }

    const apply=()=>{
        oolongApp.loadDocumentDO(offlineData.docInfo);
        close();
    }

    const drop=()=>{
        oolongApp.offlineManager.indexDBManager.deleteDocInfo();
        close();
    }

    return (
        <>
            <Modal title={"未保存提示"} open={show} onOk={close} onCancel={close}>
                <p>{`本地发现了更新版本的该文档，是否要应用,本地版本:${offlineData?.docInfo.docSetting.seq||0},远端版本:${seq}`}</p>
                <Button onClick={apply}>应用</Button>
                <Button onClick={drop}>丢弃</Button>
            </Modal>
        </>
    )
}