import {BaseButton} from "@/component/rightTopTool/BaseButton";
import {OolongApp} from "@/app/OolongApp";
import "./index.css"
import {
    moveBackward,
    moveForward,
    moveToLower,
    moveToUpper
} from "@/component/toolMenu/moreButton/MoveFunctionUtils.ts";




interface IProps{
    oolongApp:OolongApp;
}
export const ToolMorePanel = ({oolongApp}:IProps) => {

    const forward=()=>{
        moveForward(oolongApp);
    }

    const backward=()=>{
        moveBackward(oolongApp);
    }

    const toUpper=()=>{
        moveToUpper(oolongApp);
    }

    const toLower=()=>{
        moveToLower(oolongApp)
    }

    return (
        <div className={"tool-more-panel"}>
            <BaseButton btnText={"向上移动层级"} className={"tool-more-btn"} onClick={forward}/>
            <BaseButton btnText={"向下移动层级"} className={"tool-more-btn"} onClick={backward}/>
            <BaseButton btnText={"移动到最底层"} className={"tool-more-btn"} onClick={toLower}/>
            <BaseButton btnText={"移动到最上层"} className={"tool-more-btn"} onClick={toUpper}/>
        </div>
    )
}