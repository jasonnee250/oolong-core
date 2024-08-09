import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import TextIcon from '@/resource/icons/TextIcon.svg?react'
import OrderIcon from '@/resource/icons/text/list-ol.svg?react'
import UnOrderIcon from '@/resource/icons/text/list-ul.svg?react'
import "./index.css"
import {ParaListInfo, TextListEnum, TextListInfo} from "@/text/base/TextListInfo.ts";
import store from "@/store/RootStore.ts";
import {TextParagraphListLog} from "@/action/log/text/TextParagraphListLog.ts";
import {changeTextListInfo} from "@/store/reducer/ToolMenuStateReducer.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongParagraph} from "@/text/base/OolongParagraph.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

interface IProps {
    oolongApp: OolongApp;
    currentTextListEnum?:TextListEnum
}

export const TextOrderPanel = ({oolongApp,currentTextListEnum}: IProps) => {

    const clickListType = (listType: TextListEnum) => {

        //选中节点情况
        const selectManager = oolongApp.auxiliaryManager.selectManager;

        if (selectManager.selectNodes.size === 0) {
            return;
        }
        let listInfo:TextListInfo={listType: TextListEnum.None, levelNum: 0};
        oolongApp.actionManager.execAction(new StartLog());
        for(const ele of selectManager.selectNodes){
            const node = ele as OolongNode|OolongLine;
            const paraList: ParaListInfo[] = [];
            if (currentTextListEnum === listType|| listType===TextListEnum.None) {
                const callback=(para:OolongParagraph)=>{
                    paraList.push({
                        pIndex: para.index || 0,
                        listInfo,
                    })
                }
                node.oolongText!.traversalParagraph(callback);
            }else if(listType===TextListEnum.UnOrdered){
                listInfo={listType: TextListEnum.UnOrdered, levelNum: 1};
                const callback=(para:OolongParagraph)=>{
                    paraList.push({
                        pIndex: para.index || 0,
                        listInfo
                    })
                }
                node.oolongText!.traversalParagraph(callback);
            }else if(listType===TextListEnum.Ordered){
                let i=0;
                const callback=(para:OolongParagraph)=>{
                    i++;
                    paraList.push({
                        pIndex: para.index || 0,
                        listInfo:{listType: TextListEnum.Ordered, levelNum: 1,orderNum:i},
                    })
                }
                node.oolongText!.traversalParagraph(callback);
                listInfo={listType: TextListEnum.Ordered, levelNum: 1,orderNum:i};
            }
            const updateLog = new TextParagraphListLog(
                node.id,
                paraList,
            );
            oolongApp.actionManager.execAction(updateLog);

        }
        oolongApp.actionManager.execAction(new EndLog());

        store.dispatch(changeTextListInfo(listInfo));
        oolongApp.auxiliaryManager.renderToolMenu();
    }

    return (
        <div className="text-order-panel">
            <ButtonContainer noneExpand={true}
                             onClick={() => clickListType(TextListEnum.None)}
                             isSelected={currentTextListEnum===TextListEnum.None||currentTextListEnum===undefined}
            >
                <TextIcon/>
            </ButtonContainer>
            <ButtonContainer noneExpand={true}
                             onClick={() => clickListType(TextListEnum.Ordered)}
                             isSelected={currentTextListEnum===TextListEnum.Ordered}
            >
                <OrderIcon/>
            </ButtonContainer>
            <ButtonContainer noneExpand={true}
                             onClick={() => clickListType(TextListEnum.UnOrdered)}
                             isSelected={currentTextListEnum===TextListEnum.UnOrdered}
            >
                <UnOrderIcon/>
            </ButtonContainer>

        </div>
    )
}