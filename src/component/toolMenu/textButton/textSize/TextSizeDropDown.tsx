import {Input, Popover} from "antd";
import {ExpandArrowIcon} from "@/component/toolMenu/ExpandArrowIcon";
import "./index.css"
import {TextSizePanel} from "@/component/toolMenu/textButton/textSize/TextSizePanel.tsx";
import {TextParagraphPropLog} from "@/action/log/text/TextParagraphPropLog.ts";
import {UpdateNodeLog} from "@/action/log/node/UpdateNodeLog.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {useEffect, useRef, useState} from "react";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog.ts";

interface IProps {
    oolongApp: OolongApp;
    currentFontSize: number;
}

export const TextSizeDropDown = ({oolongApp, currentFontSize}: IProps) => {

    const [showSize, setShowSize] = useState(currentFontSize);


    useEffect(() => {
        setShowSize(currentFontSize);
    }, [currentFontSize]);
    const click = (fontSize: number) => {

        const selectionManager = oolongApp.auxiliaryManager.selectionManager;
        if (selectionManager.selectionList.length > 0) {
            const updateLog = new TextParagraphPropLog(
                selectionManager.text!.id,
                selectionManager.start!.paragraphIndex!,
                fontSize
            );
            oolongApp.actionManager.execAction(updateLog);
            return;
        }
        //选中节点情况
        const selectManager = oolongApp.auxiliaryManager.selectManager;
        if (selectManager.selectNodes.size > 0) {
            oolongApp.actionManager.execAction(new StartLog());
            for (const ele of selectManager.selectNodes) {
                const node = ele as OolongNode | OolongLine;
                if(node instanceof OolongNode){
                    const updateLog = new UpdateNodeLog({
                        id: node.id,
                        fontSize,
                    });
                    oolongApp.actionManager.execAction(updateLog);
                }else if(node instanceof OolongLine){
                    const updateLog = new UpdateLineLog({
                        id: node.id,
                        fontSize,
                    });
                    oolongApp.actionManager.execAction(updateLog);
                }

            }
            oolongApp.actionManager.execAction(new EndLog());
        }

    }
    const onPressEnter = () => {
        const font = ref.current!.input.value;
        click(font);
    }

    const handleChange = (e: any) => {
        const {value: inputValue} = e.target;
        setShowSize(inputValue);
    }

    const ref = useRef();

    const panel = <TextSizePanel click={click} currentFontSize={currentFontSize}/>

    return (
        <Popover placement={"top"}
                 content={panel}
                 trigger="click"
        >
            <div className="text-input-container">
                <Input className="text-input-button"
                       ref={ref}
                       placeholder="14"
                       onKeyDown={(e) => e.stopPropagation()}
                       value={showSize}
                       onChange={handleChange}
                       onPressEnter={onPressEnter}
                />
                <div className="text-input-expand">
                    <ExpandArrowIcon/>
                </div>
            </div>
        </Popover>


    )
}