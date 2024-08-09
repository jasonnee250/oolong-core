import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import TopIcon from '@/resource/icons/text/text-top.svg?react'
import CenterIcon from '@/resource/icons/text/text-vertical-center.svg?react'
import BottomIcon from '@/resource/icons/text/text-bottom.svg?react'
import "./index.css"
import {OolongApp} from "@/app/OolongApp.ts";
import {TextAlignType} from "dahongpao-core";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";

interface Iprops{
    oolongApp:OolongApp;
    currentAlignType?:TextAlignType;
}
export const TextVerticalPanel = ({oolongApp,currentAlignType}:Iprops) => {

    const clickAlign=(align:TextAlignType)=>{

        //选中节点情况
        const selectManager=oolongApp.auxiliaryManager.selectManager;
        if(selectManager.selectNodes.size>0){
            oolongApp.actionManager.execAction(new StartLog());
            for(const node of selectManager.selectNodes){
                if(node instanceof OolongNode){
                    const updateLog=new UpdateNodeLog({
                        id:node.id,
                        verticalAlign:align,
                    });
                    oolongApp.actionManager.execAction(updateLog);
                }
            }
            oolongApp.actionManager.execAction(new EndLog());

        }
    }

    return (
        <div className="text-vertical-panel">
            <ButtonContainer noneExpand={true}
                             onClick={()=>clickAlign(TextAlignType.TOP_OR_LEFT)}
                             isSelected={currentAlignType===TextAlignType.TOP_OR_LEFT}
            >
                <TopIcon/>
            </ButtonContainer>
            <ButtonContainer noneExpand={true}
                             onClick={()=>clickAlign(TextAlignType.CENTER)}
                             isSelected={currentAlignType===TextAlignType.CENTER}
            >
                <CenterIcon/>
            </ButtonContainer>
            <ButtonContainer noneExpand={true}
                             onClick={()=>clickAlign(TextAlignType.BOTTOM_OR_RIGHT)}
                             isSelected={currentAlignType===TextAlignType.BOTTOM_OR_RIGHT}
            >
                <BottomIcon/>
            </ButtonContainer>
        </div>
    )
}