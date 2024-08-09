import {TextOrderPanel} from "@/component/toolMenu/textButton/textProp/TextOrderPanel";
import {TextPropsPanel} from "@/component/toolMenu/textButton/textProp/TextPropsPanel";
import {HorizonSplitLine} from "@/component/toolMenu/HorizonSplitLine";
import {TextHorizonPanel} from "@/component/toolMenu/textButton/textProp/TextHorizonPanel";
import {TextVerticalPanel} from "@/component/toolMenu/textButton/textProp/TextVerticalPanel";
import "./index.css"
import {ToolPanelTitle} from "@/component/toolMenu/ToolPanelTitle.tsx";
import {OolongApp} from "@/app/OolongApp.ts";
import {SelectViewProps} from "@/select/view/SelectViewProps.ts";

interface IProps{
    oolongApp:OolongApp;
    selectViewProps:SelectViewProps;
}
export const TextPanel = ({oolongApp,selectViewProps}:IProps) => {

    return (
        <div className="text-menu-prop-container">
            <ToolPanelTitle title={"文字属性"}/>
            <TextOrderPanel oolongApp={oolongApp} currentTextListEnum={selectViewProps.textListEnum}/>
            <TextPropsPanel oolongApp={oolongApp}
                            italic={selectViewProps.italic}
                            bold={selectViewProps.bold}
                            strikeThrough={selectViewProps.strikeThrough}
                            underline={selectViewProps.underline}
            />
            {selectViewProps.horizonAlign!==undefined && selectViewProps.verticalAlign!==undefined &&
                <HorizonSplitLine/>}
            {selectViewProps.horizonAlign!==undefined &&
                <TextHorizonPanel oolongApp={oolongApp} currentAlignType={selectViewProps.horizonAlign}/>}
            {selectViewProps.verticalAlign!==undefined &&
                <TextVerticalPanel oolongApp={oolongApp} currentAlignType={selectViewProps.verticalAlign}/>}
        </div>

    )

}