import './index.css'
import {FileButton} from "@/component/topTool/FileButton";
import {TopButtonGroup} from "@/component/topTool/TopButtonGroup";
import {SplitLine} from "@/component/common/SplitLine.tsx";
import {OolongApp} from "@/app/OolongApp.ts";

interface IProps{
    oolongApp:OolongApp;
}
export const TopContainer = ({oolongApp}:IProps) => {

    return (
        <div className='top-container'>
            <FileButton oolongApp={oolongApp}/>
            <SplitLine/>
            <TopButtonGroup oolongApp={oolongApp}/>
            <SplitLine/>
        </div>
    )
}