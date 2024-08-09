import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import "./index.css"
import BoldIcon from '@/resource/icons/text/type-bold.svg?react'
import ItalicIcon from '@/resource/icons/text/type-italic.svg?react'
import UnderLineIcon from '@/resource/icons/text/type-underline.svg?react'
import StrikethroughLineIcon from '@/resource/icons/text/type-strikethrough.svg?react'
import {CharPropInfo, EditCharPropLog} from "@/action/log/text/EditCharPropLog.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog.ts";

interface IProps{
    oolongApp:OolongApp;
    italic?:boolean;
    bold?:boolean;
    strikeThrough?:boolean,
    underline?:boolean,
}
export const TextPropsPanel=({oolongApp,italic,bold,strikeThrough,underline}:IProps)=>{

    const clickItalic = () => {
        const selectionManager = oolongApp.auxiliaryManager.selectionManager;
        if (selectionManager.selectionList.length > 0) {
            const updateLog = new EditCharPropLog(selectionManager.text!.id,
                selectionManager.start!,
                selectionManager.end!,
                {italic:!italic});
            oolongApp.actionManager.execAction(updateLog);
            return;
        }
        //选中节点情况
        const selectManager=oolongApp.auxiliaryManager.selectManager;
        oolongApp.actionManager.execAction(new StartLog());

        for(const node of  selectManager.selectNodes){
            if(node instanceof OolongNode){
                const updateLog=new UpdateNodeLog({
                    id:node.id,
                    italic:!italic,
                });
                oolongApp.actionManager.execAction(updateLog);
            }else if(node instanceof OolongLine){
                const updateLog=new UpdateLineLog({
                    id:node.id,
                    italic:!italic,
                });
                oolongApp.actionManager.execAction(updateLog);
            }

        }
        oolongApp.actionManager.execAction(new EndLog());

    }

    const clickBold=()=> {
        const selectionManager = oolongApp.auxiliaryManager.selectionManager;
        //有选区情况
        if (selectionManager.selectionList.length > 0) {
            const updateLog = new EditCharPropLog(selectionManager.text!.id,
                selectionManager.start!,
                selectionManager.end!,
                {bold:!bold}
            );
            oolongApp.actionManager.execAction(updateLog);
            return;
        }
        //选中节点情况
        const selectManager = oolongApp.auxiliaryManager.selectManager;

        oolongApp.actionManager.execAction(new StartLog());

        for(const node of  selectManager.selectNodes){
            if(node instanceof OolongNode){
                const updateLog=new UpdateNodeLog({
                    id: node.id,
                    bold: !bold,
                });
                oolongApp.actionManager.execAction(updateLog);
            }else if(node instanceof OolongLine){
                const updateLog=new UpdateLineLog({
                    id: node.id,
                    bold: !bold,
                });
                oolongApp.actionManager.execAction(updateLog);
            }

        }
        oolongApp.actionManager.execAction(new EndLog());
    }

    const clickCharProp = (charPropInfo: CharPropInfo) => {
        const selectionManager = oolongApp.auxiliaryManager.selectionManager;
        if (selectionManager.selectionList.length > 0) {
            const updateLog = new EditCharPropLog(selectionManager.text!.id,
                selectionManager.start!,
                selectionManager.end!,
                charPropInfo
            );
            oolongApp.actionManager.execAction(updateLog);
            return;
        }
        //选中节点情况
        const selectManager = oolongApp.auxiliaryManager.selectManager;
        if (selectManager.selectNodes.size > 0) {
            oolongApp.actionManager.execAction(new StartLog());
            for(const ele of  selectManager.selectNodes){
                const node = ele as OolongNode|OolongLine;
                if(!node.oolongText?.hasText()){
                    continue;
                }
                const updateLog = new EditCharPropLog(node.id,
                    node.oolongText!.getHeadCursorPosition(),
                    node.oolongText!.getTailTextCursorPosition(),
                    charPropInfo
                );
                oolongApp.actionManager.execAction(updateLog);
            }
            oolongApp.actionManager.execAction(new EndLog());
        }
    }


    return (
        <div className="text-props-panel">
            <ButtonContainer noneExpand={true} onClick={clickBold} isSelected={bold}>
                <BoldIcon/>
            </ButtonContainer>
            <ButtonContainer noneExpand={true} onClick={()=>clickCharProp({strikeThrough:!strikeThrough})} isSelected={strikeThrough}>
                <StrikethroughLineIcon/>
            </ButtonContainer>
            <ButtonContainer noneExpand={true} onClick={()=>clickCharProp({underline:!underline})} isSelected={underline}>
                <UnderLineIcon/>
            </ButtonContainer>
            <ButtonContainer noneExpand={true} onClick={clickItalic} isSelected={italic}>
                <ItalicIcon/>
            </ButtonContainer>

        </div>
    )
}