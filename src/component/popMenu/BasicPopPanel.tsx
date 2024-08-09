import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import TextIcon from '@/resource/icons/TextIcon.svg?react'
import TextH1Icon from '@/resource/icons/text/type-h1.svg?react'
import TextH2Icon from '@/resource/icons/text/type-h2.svg?react'
import TextH3Icon from '@/resource/icons/text/type-h3.svg?react'
import TextH4Icon from '@/resource/icons/text/type-h4.svg?react'
import TextOrderIcon from '@/resource/icons/text/list-ol.svg?react'
import TextUnOrderIcon from '@/resource/icons/text/list-ul.svg?react'
import TextLeftIcon from '@/resource/icons/text/text-left.svg?react'
import TextCenterIcon from '@/resource/icons/text/text-center.svg?react'
import TextRightIcon from '@/resource/icons/text/text-right.svg?react'
import {ToolPanelTitle} from "@/component/toolMenu/ToolPanelTitle";
import {TextParagraphPropLog} from "@/action/log/text/TextParagraphPropLog.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import store from "@/store/RootStore.ts";
import {MainTextId} from "@/text/config/OolongTextConstants.ts";
import {changeFontSize, changeHorizonAlign, changeTextListInfo} from "@/store/reducer/ToolMenuStateReducer.ts";
import {TextListEnum, TextListInfo} from "@/text/base/TextListInfo.ts";
import {TextParagraphListLog} from "@/action/log/text/TextParagraphListLog.ts";
import {TextAlignType} from "dahongpao-core";

interface IProps{
    oolongApp:OolongApp;
    curFontSize?:number;
    curTextAlignType?:TextAlignType;
    curTextListEnum?:TextListEnum;
}
export const BasicPopPanel = ({oolongApp,curFontSize,curTextListEnum,curTextAlignType}:IProps) => {

    const click=(fontSize:number)=>{
        const currentToolInfo = store.getState().toolMenuState.info;
        const updateLog=new TextParagraphPropLog(
            MainTextId,
            currentToolInfo.pIndex||0,
            fontSize
        );
        oolongApp.actionManager.execAction(updateLog);
        store.dispatch(changeFontSize(fontSize));
    }

    const clickListType=(listType:TextListEnum)=>{
        const currentToolInfo = store.getState().toolMenuState.info;
        if(!currentToolInfo.textListInfo){
            return;
        }
        if(currentToolInfo.textListInfo.listType===listType){
            const updateLog=new TextParagraphListLog(
                MainTextId,
                [{pIndex:currentToolInfo.pIndex||0,
                listInfo:{listType:TextListEnum.None,levelNum:0}}],
            );
            oolongApp.actionManager.execAction(updateLog);
            store.dispatch(changeTextListInfo({listType:TextListEnum.None,levelNum:0} as TextListInfo));
            return;
        }
        const listInfo:TextListInfo={listType,levelNum:0};
        if(listType===TextListEnum.Ordered){
            listInfo.orderNum=1;
        }
        const paraIndex=currentToolInfo.pIndex||0;
        listInfo.levelNum=1;
        const updateLog=new TextParagraphListLog(
            MainTextId,
            [{pIndex:paraIndex,
            listInfo}],
        );
        oolongApp.actionManager.execAction(updateLog);
        store.dispatch(changeTextListInfo(listInfo));
    }

    const clickHorizonAlign=(horizon:TextAlignType)=>{
        const currentToolInfo = store.getState().toolMenuState.info;
        const updateLog=new TextParagraphPropLog(
            MainTextId,
            currentToolInfo.pIndex||0,
            undefined,
            horizon
        );
        oolongApp.actionManager.execAction(updateLog);
        store.dispatch(changeHorizonAlign(horizon));
    }

    return (
        <div className="basic-pop-panel">
            <ToolPanelTitle title={"基础"}/>
            <div className={"basic-pop-panel-grid"}>
                <ButtonContainer noneExpand={true} onClick={()=>click(16)} isSelected={curFontSize===16}>
                    <TextIcon/>
                </ButtonContainer>
                <ButtonContainer noneExpand={true} onClick={()=>click(26)} isSelected={curFontSize===26}>
                    <TextH1Icon/>
                </ButtonContainer>
                <ButtonContainer noneExpand={true} onClick={()=>click(22)} isSelected={curFontSize===22}>
                    <TextH2Icon/>
                </ButtonContainer>
                <ButtonContainer noneExpand={true} onClick={()=>click(20)} isSelected={curFontSize===20}>
                    <TextH3Icon/>
                </ButtonContainer>
                <ButtonContainer noneExpand={true} onClick={()=>click(18)} isSelected={curFontSize===18}>
                    <TextH4Icon/>
                </ButtonContainer>
                <ButtonContainer noneExpand={true} onClick={()=>clickListType(TextListEnum.Ordered)}
                                 isSelected={curTextListEnum===TextListEnum.Ordered}>
                    <TextOrderIcon/>
                </ButtonContainer>
                <ButtonContainer noneExpand={true} onClick={()=>clickListType(TextListEnum.UnOrdered)}
                                 isSelected={curTextListEnum===TextListEnum.UnOrdered}>
                    <TextUnOrderIcon/>
                </ButtonContainer>
                <ButtonContainer noneExpand={true} onClick={()=>clickHorizonAlign(TextAlignType.TOP_OR_LEFT)}
                                 isSelected={curTextAlignType===TextAlignType.TOP_OR_LEFT}>
                    <TextLeftIcon/>
                </ButtonContainer>
                <ButtonContainer noneExpand={true} onClick={()=>clickHorizonAlign(TextAlignType.CENTER)}
                                 isSelected={curTextAlignType===TextAlignType.CENTER}>
                    <TextCenterIcon/>
                </ButtonContainer>
                <ButtonContainer noneExpand={true} onClick={()=>clickHorizonAlign(TextAlignType.BOTTOM_OR_RIGHT)}
                                 isSelected={curTextAlignType===TextAlignType.BOTTOM_OR_RIGHT}>
                    <TextRightIcon/>
                </ButtonContainer>
            </div>
        </div>

    )
}