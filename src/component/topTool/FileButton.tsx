import FileButtonIcon from "@/resource/icons/FileButtonIcon.svg"
import './index.css'
import {OolongApp} from "@/app/OolongApp.ts";

interface IProps{
    oolongApp:OolongApp;
}
export const FileButton = ({oolongApp}:IProps) => {

    const click=()=>{
        oolongApp.actionManager.networkManager.init();
    }

    return (
        <div className='file-button' onClick={click}>
            <div className='file-icon'>
                <img src={FileButtonIcon}/>
            </div>
            <p className='file-text'>文件</p>
        </div>
    )
}