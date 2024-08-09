import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import {BorderWidthUnit} from "@/component/toolMenu/borderButton/BorderWidthUnit.tsx";
import "./index.css"
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongLineDO} from "@/file/OolongLineDO.ts";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

interface IProps{
    oolongApp:OolongApp;
    currentBorderWidth:number;
}

export const BorderWithPanel = ({oolongApp,currentBorderWidth}:IProps) => {

    const widthList = [
        1, 2, 4, 6
    ];

    const clickBorderWidth = (borderWidth: number) => {
        const nodes = oolongApp.auxiliaryManager.selectManager.selectNodes;
        oolongApp.actionManager.execAction(new StartLog());

        for (const node of nodes) {
            if (node instanceof OolongNode) {
                const updateData: Partial<OolongNodeDO> = {
                    id: node.id,
                    borderWidth,
                }
                const updateLog = new UpdateNodeLog(updateData);
                oolongApp.actionManager.execAction(updateLog);
            } else if (node instanceof OolongLine) {
                const updateData: Partial<OolongLineDO> = {
                    id: node.id,
                    width: borderWidth,
                }
                const updateLog = new UpdateLineLog(updateData);
                oolongApp.actionManager.execAction(updateLog);
            }
        }
        oolongApp.actionManager.execAction(new EndLog());

    }


    return (
        <div className="border-width-panel">
            {widthList.map(p =>
                <ButtonContainer noneExpand={true}>
                    <BorderWidthUnit radius={p} onClick={clickBorderWidth}
                                     isSelected={p === currentBorderWidth}/>
                </ButtonContainer>
            )}
        </div>
    )
}