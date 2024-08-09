import {createSlice} from "@reduxjs/toolkit";
import {ToolEnum} from "@/tool/ToolEnum";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {DocMode} from "@/file/DocSettingDO.ts";

interface IState{
    tool:ToolEnum,
    shapeType:OolongLineType|OolongShapeType,
    scale:number,
    docMode:DocMode,
    backgroundColor:string,
}

const initialState:IState={
    tool:ToolEnum.DEFAULT,
    shapeType:OolongShapeType.Rect,
    docMode:DocMode.Document,
    scale:1,
    backgroundColor:"#EEEEEE",
}

export const globalStateReducer = createSlice({
    name:"globalState",
    initialState:initialState,
    reducers:{
        updateTool:(state,action)=>{
            state.tool=action.payload.tool;
            state.shapeType=action.payload.shapeType;
        },
        updateScale:(state,action)=>{
            state.scale=action.payload;
        },
        updatePageType:(state,action)=>{
            state.pageType=action.payload;
        },
        updateDocMode:(state,action)=>{
            state.docMode=action.payload;
        },
        updateBackgroundColor:(state,action)=>{
            state.backgroundColor=action.payload;
        }
    }

})

export const { updateTool,updateScale,updatePageType,updateBackgroundColor,updateDocMode } = globalStateReducer.actions;
export default globalStateReducer.reducer;