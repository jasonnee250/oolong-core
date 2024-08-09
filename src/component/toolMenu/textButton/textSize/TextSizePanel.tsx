import {HorizonSplitLine} from "@/component/toolMenu/HorizonSplitLine";
import "./index.css"
import {TextSizeItem} from "@/component/toolMenu/textButton/textSize/TextSizeItem";

interface IProps{
    click:(fontSize:number)=>void;
    currentFontSize:number;
}
export const TextSizePanel = ({click,currentFontSize}:IProps) => {


    return <div className="text-size-menu-panel">
        <TextSizeItem title={"h1"} click={()=>click(26)} selected={currentFontSize===26}/>
        <TextSizeItem title={"h2"} click={()=>click(22)} selected={currentFontSize===22}/>
        <TextSizeItem title={"h3"} click={()=>click(20)} selected={currentFontSize===20}/>
        <TextSizeItem title={"正文"} click={()=>click(16)} selected={currentFontSize===16}/>
        <HorizonSplitLine/>
        <TextSizeItem title={"12"} click={()=>click(12)} selected={currentFontSize===12}/>
        <TextSizeItem title={"14"} click={()=>click(14)} selected={currentFontSize===14}/>
        <TextSizeItem title={"24"} click={()=>click(24)} selected={currentFontSize===24}/>
        <TextSizeItem title={"36"} click={()=>click(36)} selected={currentFontSize===36}/>
        <TextSizeItem title={"72"} click={()=>click(72)} selected={currentFontSize===72}/>
    </div>
}