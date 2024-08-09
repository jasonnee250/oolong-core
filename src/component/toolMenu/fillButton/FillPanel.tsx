import "@/component/toolMenu/fillButton/index.css"
import {FillButtonUnit} from "@/component/toolMenu/fillButton/FillButtonUnit.tsx";
import {OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {ButtonContainer} from "@/component/toolMenu/ButtonContainer.tsx";
import "./index.css"
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

interface IProps{
    oolongApp:OolongApp;
    currentColor:string;
    colorList:string[]
}
export const FillPanel = ({colorList,oolongApp,currentColor}:IProps) => {

    // const [colorMap,setColorMap]=useState(new Map<string,string>());

    const click=(color:string)=>{
        const nodes=oolongApp.auxiliaryManager.selectManager.selectNodes;
        oolongApp.actionManager.execAction(new StartLog());

        for(const node of nodes){
            if(node.type!==OolongNodeType.Shape){
                continue;
            }
            const updateData:Partial<OolongNodeDO>={
                id:node.id,
                color,
            }
            const updateLog=new UpdateNodeLog(updateData);
            oolongApp.actionManager.execAction(updateLog);
        }
        oolongApp.actionManager.execAction(new EndLog());

    }

    const select=(color:string)=>{
        return color === currentColor;
    }

    return (
        <div className="fill-panel" >
            {colorList.map(p =>
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