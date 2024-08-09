import {OolongApp} from "@/app/OolongApp";
import "./index.css"
import {useAppSelector} from "@/store/hooks.ts";
import {
    changeMenuType,
    MenuType
} from "@/store/reducer/ToolMenuStateReducer.ts";
import TextHoverIcon from '@/resource/icons/addTips.svg?react'
import {Popover} from "antd";
import store from "@/store/RootStore.ts";
import {PopPanel} from "@/component/popMenu/PopPanel.tsx";

interface IProp {
    oolongApp: OolongApp
}

export const PopMenu = ({oolongApp}: IProp) => {

    const toolInfo = useAppSelector((state) => state.toolMenuState.info);

    const style = {
        left: toolInfo.x-20 + "px",
        top: toolInfo.y + "px",
    }

    const clickHeadIcon=()=>{
        store.dispatch(changeMenuType(MenuType.ParagraphHead));
    }

    const panel=<PopPanel oolongApp={oolongApp} curFontSize={toolInfo.pFontSize} curTextListEnum={toolInfo.textListInfo?.listType} curTextAlignType={toolInfo.horizonAlign}/>

    const handleOpen=(open:boolean)=>{
        if(open){
            store.dispatch(changeMenuType(MenuType.PopMenu));
        }else{
            store.dispatch(changeMenuType(MenuType.ParagraphHead));
        }
    }

    return (
        <>
            {
                (toolInfo.menuType===MenuType.PopMenu ||toolInfo.menuType===MenuType.ParagraphHead)&&
                <Popover placement={"bottomLeft"}
                         content={panel}
                         trigger={"click"}
                         onOpenChange={handleOpen}
                >
                    <div className="pop-menu" style={style} onPointerMove={clickHeadIcon}>
                        <TextHoverIcon/>
                    </div>
                </Popover>

            }

        </>
    )
}