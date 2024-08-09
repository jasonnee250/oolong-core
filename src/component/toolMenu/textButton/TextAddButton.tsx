import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import AddTextIcon from '@/resource/icons/text/addText.svg?react'
import {OolongApp} from "@/app/OolongApp.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {FocusTextLog, FocusTextType} from "@/action/log/text/FocusBlurTextLog.ts";
import {TextCursorPosition} from "@/text/base/TextCursorPosition";
import {OolongLine} from "@/graphics/OolongLine.ts";

interface IProps{
    oolongApp:OolongApp;
}
export const TextAddButton = ({oolongApp}:IProps) => {

    const click=()=>{
        const selectNodes=oolongApp.auxiliaryManager.selectManager.selectNodes;
        if(selectNodes.size===0){
            return;
        }
        const selectNode=[...selectNodes][0];
        if(selectNode instanceof OolongNode){
            oolongApp.actionManager.execAction(new FocusTextLog(selectNode.id,FocusTextType.Editing,new TextCursorPosition(0,0,-1)));
        }else if(selectNode instanceof OolongLine){
            oolongApp.actionManager.execAction(new FocusTextLog(selectNode.id,FocusTextType.Editing,new TextCursorPosition(0,0,-1)));
        }
    }

    return (
        <ButtonContainer noneExpand={true} onClick={click}>
            <AddTextIcon/>
        </ButtonContainer>
    )
}