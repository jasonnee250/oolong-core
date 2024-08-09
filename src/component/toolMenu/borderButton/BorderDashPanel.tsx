import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import StraightLine from '@/resource/icons/straightLine.svg?react'
import DashLine from '@/resource/icons/dashline.svg?react'
import DashLine2 from '@/resource/icons/dashline2.svg?react'
import "./index.css"
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongLineDO} from "@/file/OolongLineDO.ts";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {LineDashType} from "dahongpao-core";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

interface IProps{
    oolongApp:OolongApp;
    currentDashType?:LineDashType;
}
export const BorderDashPanel = ({oolongApp,currentDashType}:IProps) => {

    const click = (lineDashType: LineDashType) => {
        const nodes = oolongApp.auxiliaryManager.selectManager.selectNodes;
        oolongApp.actionManager.execAction(new StartLog());

        for (const node of nodes) {
            if (node instanceof OolongNode) {
                const updateData: Partial<OolongNodeDO> = {
                    id: node.id,
                    lineDashType,
                }
                const updateLog = new UpdateNodeLog(updateData);
                oolongApp.actionManager.execAction(updateLog);
            } else if (node instanceof OolongLine) {
                const updateData: Partial<OolongLineDO> = {
                    id: node.id,
                    lineDashType,
                }
                const updateLog = new UpdateLineLog(updateData);
                oolongApp.actionManager.execAction(updateLog);
            }

        }
        oolongApp.actionManager.execAction(new EndLog());

    }

    return (
        <div className={"border-dash-panel"}>
            <ButtonContainer noneExpand={true} onClick={()=>click(LineDashType.None)} isSelected={currentDashType===LineDashType.None}>
                <StraightLine/>
            </ButtonContainer>
            <ButtonContainer noneExpand={true} onClick={()=>click(LineDashType.Dash1)} isSelected={currentDashType===LineDashType.Dash1}>
                <DashLine/>
            </ButtonContainer>
            <ButtonContainer noneExpand={true} onClick={()=>click(LineDashType.Dash2)} isSelected={currentDashType===LineDashType.Dash2}>
                <DashLine2/>
            </ButtonContainer>
        </div>
    )
}