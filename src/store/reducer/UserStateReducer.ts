import {createSlice} from "@reduxjs/toolkit";

export interface UserInfo{
    userId:string,
    userName:string,
    userType:number,
}

interface IState{
    userInfo:UserInfo
}

const initialState:IState={
    userInfo:{
        userId:"",
        userName:"",
        userType:0,
    }
}

export const userStateReducer = createSlice({
    name:"userState",
    initialState:initialState,
    reducers:{
        setUserInfo:(state,action)=>{
            state.userInfo=action.payload;
        },
    }

})

export const { setUserInfo } = userStateReducer.actions;
export default userStateReducer.reducer;