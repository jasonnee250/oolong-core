import "./index.css"
import {FillButton} from "@/component/toolMenu/fillButton/FillButton.tsx";
import {BorderButton} from "@/component/toolMenu/borderButton/BorderButton.tsx";
import {useAppSelector} from "@/store/hooks.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {MenuType} from "@/store/reducer/ToolMenuStateReducer.ts";
import {ShapeButton} from "@/component/toolMenu/shapeButton/ShapeButton.tsx";
import {SplitLine} from "@/component/common/SplitLine.tsx";
import {TextColorButton} from "@/component/toolMenu/textButton/textColor/TextColorButton.tsx";
import {TextPropButton} from "@/component/toolMenu/textButton/textProp/TextPropButton.tsx";
import {TextSizeDropDown} from "@/component/toolMenu/textButton/textSize/TextSizeDropDown.tsx";
import {MoreButton} from "@/component/toolMenu/moreButton/MoreButton.tsx";
import {TextAddButton} from "@/component/toolMenu/textButton/TextAddButton.tsx";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {LineShapeButton} from "@/component/toolMenu/lineShapeButton/LineShapeButton.tsx";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";


interface IProps {
    oolongApp: OolongApp;
}

export const ToolMenu = ({oolongApp}: IProps) => {

    const toolMenuInfo = useAppSelector((state) => state.toolMenuState.info);

    const selectProps = useAppSelector((state) => state.selectPropState.selectProp);

    const style = {
        left: toolMenuInfo.x + "px",
        top: toolMenuInfo.y + "px",
    }

    return (
        <>
            {
                toolMenuInfo.menuType === MenuType.ActionMenu ?
                    <div className="tool-menu" style={style}>
                        {selectProps.type===OolongNodeType.Line && <LineShapeButton oolongApp={oolongApp} shapeType={selectProps.shapeType as OolongLineType}/>}
                        {selectProps.type===OolongNodeType.Shape && <ShapeButton oolongApp={oolongApp} shapeType={selectProps.shapeType as OolongShapeType}/>}
                        <SplitLine/>
                        {selectProps.color && <FillButton color={selectProps.color} oolongApp={oolongApp}/>}
                        {selectProps.borderColor && <BorderButton color={selectProps.borderColor} oolongApp={oolongApp} borderWidth={selectProps.borderWidth||2} currentDashType={selectProps.lineDashType}/>}
                        <SplitLine/>
                        {selectProps.hasText &&
                            <>
                                <TextColorButton oolongApp={oolongApp} currentTextColor={selectProps.fontColor!} currentBgColor={selectProps.fontBackgroundColor}/>
                                <TextSizeDropDown oolongApp={oolongApp} currentFontSize={selectProps.fontSize||14}/>
                                <TextPropButton oolongApp={oolongApp} selectViewProps={selectProps}/>
                            </>
                        }
                        {!selectProps.hasText && <TextAddButton oolongApp={oolongApp}/>}
                        <SplitLine/>
                        <MoreButton oolongApp={oolongApp}/>
                    </div>
                    : <></>
            }
        </>

    )
}