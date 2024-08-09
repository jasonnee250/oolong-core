import {createSlice} from "@reduxjs/toolkit";

export interface DocInfo{
    docId:string,
    docTitle:string,
}
interface IState{
    docInfo:DocInfo
}

const initialState:IState={
    docInfo:{
        docId:"",
        docTitle:"",
    }
}

export const docStateReducer = createSlice({
    name:"docState",
    initialState:initialState,
    reducers:{
        setDocInfo:(state,action)=>{
            state.docInfo=action.payload;
        },
    }

})

export const { setDocInfo } = docStateReducer.actions;
export default docStateReducer.reducer;