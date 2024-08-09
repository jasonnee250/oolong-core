import SaveIcon from '@/resource/icons/DownloadButtonIcon.svg'
import './index.css'
import {OolongApp} from "@/app/OolongApp.ts";

interface IProps{
    oolongApp:OolongApp;
}
export const DownloadButton = ({oolongApp}:IProps) => {

    const save=()=>{
        const documentDO=oolongApp.serializeManager.serializeTo();
        const link=document.createElement('a');
        link.download='file1.oolong';
        const cache=JSON.stringify(documentDO);
        const cacheURL=window.URL.createObjectURL(new Blob([cache],{type:'text'}));
        link.href=cacheURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(cacheURL);
    }

    return (
        <div className='button-icon' onClick={save}>
            <img src={SaveIcon}/>
        </div>
    )
}