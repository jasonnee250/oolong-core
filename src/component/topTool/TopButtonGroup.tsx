import './index.css'
import {DownloadButton} from "@/component/topTool/DownloadButton";
import {OpenButton} from "@/component/topTool/OpenButton";
import {SearchButton} from "@/component/topTool/SearchButton";
import {UndoButton} from "@/component/topTool/UndoButton";
import {RedoButton} from "@/component/topTool/RedoButton";
import {OolongApp} from "@/app/OolongApp.ts";
import {SaveButton} from "@/component/topTool/SaveButton.tsx";

interface IProps{
    oolongApp:OolongApp;
}
export const TopButtonGroup = ({oolongApp}:IProps) => {

    return (
        <div className='button-group'>
            <DownloadButton  oolongApp={oolongApp}/>
            <OpenButton oolongApp={oolongApp}/>
            <SearchButton/>
            <UndoButton/>
            <RedoButton/>
        </div>
    )
}