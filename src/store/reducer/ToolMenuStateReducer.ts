import {createSlice} from "@reduxjs/toolkit";
import {TextListInfo} from "@/text/base/TextListInfo.ts";
import {TextAlignType} from "dahongpao-core";

export enum MenuType{
    None,
    PopMenu,
    ActionMenu,
    ParagraphHead,
    QuickMenu,
    DbClickQuickMenu,
}
interface IStateInfo {
    x: number,
    y: number,
    menuType:MenuType,
    pIndex?:number,
    pFontSize?:number,
    horizonAlign?:TextAlignType,
    textListInfo?:TextListInfo,

}

interface IState {
    info: IStateInfo,
}

const initialState: IState = {
    info:
        {
            x: 0,
            y: 0,
            menuType:MenuType.None,
            pIndex:0,
            pFontSize:16,
        }
}

export const toolMenuStateReducer = createSlice({
    name: "toolMenuState",
    initialState: initialState,
    reducers: {
        setToolMenu: (state, action) => {
            console.log("===>njx:",action.payload)
            state.info = action.payload;
        },
        changeMenuType:(state, action) => {
            state.info.menuType = action.payload;
        },
        changeFontSize:(state, action) => {
            state.info.pFontSize = action.payload;
        },
        changeHorizonAlign:(state, action) => {
            state.info.horizonAlign = action.payload;
        },
        changeTextListInfo:(state, action) => {
            state.info.textListInfo = action.payload;
        },
    }

})

export const {setToolMenu,changeMenuType,changeHorizonAlign,changeFontSize,changeTextListInfo} = toolMenuStateReducer.actions;
export default toolMenuStateReducer.reducer;