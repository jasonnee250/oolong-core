import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import {FillButtonUnit} from "@/component/toolMenu/fillButton/FillButtonUnit";
import {textBgColorConfig} from "@/component/toolMenu/textButton/textColor/TextColorConfig";
import "./index.css"
import {OolongApp} from "@/app/OolongApp.ts";
import {EditCharPropLog} from "@/action/log/text/EditCharPropLog.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

interface IProps{
    oolongApp:OolongApp;
    currentBgColor?:string;
}
export const TextBgColorPanel = ({oolongApp,currentBgColor}:IProps) => {

    const clickColor = (color: string) => {
        const selectionManager = oolongApp.auxiliaryManager.selectionManager;
        if (selectionManager.selectionList.length > 0) {
            const updateLog = new EditCharPropLog(selectionManager.text!.id,
                selectionManager.start!,
                selectionManager.end!,
                {bgColor:color}
            );
            oolongApp.actionManager.execAction(updateLog);
            return;
        }
        //选中节点情况
        const selectManager = oolongApp.auxiliaryManager.selectManager;
        if (selectManager.selectNodes.size > 0) {
            oolongApp.actionManager.execAction(new StartLog());
            for(const ele of selectManager.selectNodes){
                const node = ele as OolongNode|OolongLine;
                if(!node.oolongText?.hasText()){
                    continue;
                }
                const updateLog = new EditCharPropLog(node.id,
                    node.oolongText!.getHeadCursorPosition(),
                    node.oolongText!.getTailTextCursorPosition(),
                    {bgColor:color}
                );
                oolongApp.actionManager.execAction(updateLog);
            }
            oolongApp.actionManager.execAction(new EndLog());

            return;
        }

    }

    return (
        <div className="text-bg-color-panel">
            {textBgColorConfig.map(p =>
                <ButtonContainer noneExpand={true}
                                 onClick={()=>clickColor(p)}
                >
                    <FillButtonUnit
                        color={p}
                        isSelected={p===currentBgColor}
                    />
                </ButtonContainer>
            )}
        </div>
    )
}