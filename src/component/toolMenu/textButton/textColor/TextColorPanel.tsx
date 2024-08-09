import {TextColorUnit} from "@/component/toolMenu/textButton/textColor/TextColorUnit";
import {textColorConfig} from "@/component/toolMenu/textButton/textColor/TextColorConfig";
import {EditCharPropLog} from "@/action/log/text/EditCharPropLog.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";

interface IProps {
    oolongApp:OolongApp;
    currentTextColor:string;
}
export const TextColorPanel = ({oolongApp,currentTextColor}:IProps) => {

    const clickColor = (color: string) => {
        const selectionManager = oolongApp.auxiliaryManager.selectionManager;
        if (selectionManager.selectionList.length > 0) {
            const updateLog = new EditCharPropLog(selectionManager.text!.id,
                selectionManager.start!,
                selectionManager.end!,
                {color}
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
                const updateLog = new UpdateNodeLog({
                    id: node.id,
                    fontColor: color,
                });
                oolongApp.actionManager.execAction(updateLog);
            }
            oolongApp.actionManager.execAction(new EndLog());
            return;
        }

    }

    return (
        <div className={"text-color-panel"}>
            {textColorConfig.map(p=>
                <TextColorUnit color={p} click={clickColor} isSelected={p===currentTextColor}/>
            )}

        </div>
    )
}