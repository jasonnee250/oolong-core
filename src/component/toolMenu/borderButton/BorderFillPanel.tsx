import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import {FillButtonUnit} from "@/component/toolMenu/fillButton/FillButtonUnit";
import {borderColorConfig} from "@/component/toolMenu/borderButton/BorderColorConfig.ts";
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
    currentColor:string
}
export const BorderFillPanel=({oolongApp,currentColor}:IProps)=>{

    const click = (color: string) => {
        const nodes = oolongApp.auxiliaryManager.selectManager.selectNodes;
        oolongApp.actionManager.execAction(new StartLog());

        for (const node of nodes) {
            if (node instanceof OolongNode) {
                const updateData: Partial<OolongNodeDO> = {
                    id: node.id,
                    borderColor: color,
                }
                const updateLog = new UpdateNodeLog(updateData);
                oolongApp.actionManager.execAction(updateLog);
            } else if (node instanceof OolongLine) {
                const updateData: Partial<OolongLineDO> = {
                    id: node.id,
                    color,
                }
                const updateLog = new UpdateLineLog(updateData);
                oolongApp.actionManager.execAction(updateLog);
            }

        }
        oolongApp.actionManager.execAction(new EndLog());

    }

    const select = (color: string) => {
        return color === currentColor;
    }


    return (
        <div className="border-color-panel">
            {borderColorConfig.map(p =>
                <ButtonContainer noneExpand={true}>
                    <FillButtonUnit
                        color={p}
                        onClick={click}
                        isSelected={select(p)}
                    />
                </ButtonContainer>
            )}
        </div>
    )
}