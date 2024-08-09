import OpenIcon from '@/resource/icons/OpenButtonIcon.svg'
import './index.css'
import React, {useRef} from "react";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {OolongApp} from "@/app/OolongApp.ts";

interface IProps{
    oolongApp:OolongApp;
}
export const OpenButton =({oolongApp}:IProps)=>{

    const inputRef=useRef();

    const open=(event)=>{
        const files=event.target.files;
        const file=files[0] as File;
        const reader=new FileReader();
        reader.readAsText(file,"UTF-8");
        reader.onload=function (evt) {
            const res=evt.target!.result!;
            oolongApp.load(res as string);
        }
    }

    const onClick = () => {
        inputRef.current?.click();
    }

    return (
        <div className='button-icon' onPointerDown={onClick}>
            <input className='file-upload'
                   type='file'
                   accept="oolong"
                   multiple={true}
                   ref={inputRef}
                   onChange={open}
            />
            <img src={OpenIcon}/>

        </div>
    )

}