import {createSlice} from "@reduxjs/toolkit";
import {DocInfoCard} from "@/store/reducer/DocInfo";
import {DocumentVO} from "@/network/response/DocumentVO.ts";



interface IState{
    docInfoList:DocumentVO[];
}

const initialState:IState={
    docInfoList:[],
}

export const docListStateReducer = createSlice({
    name:"docListState",
    initialState:initialState,
    reducers:{
        setDocListInfo:(state,action)=>{
            state.docInfoList=action.payload;
        },
    }

})

export const { setDocListInfo } = docListStateReducer.actions;
export default docListStateReducer.reducer;