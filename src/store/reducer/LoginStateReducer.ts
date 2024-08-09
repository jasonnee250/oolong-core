import {createSlice} from "@reduxjs/toolkit";

export enum LoginStateEnum{
    Normal,
    Create,
    CreateSucc,
    Login,
}
export interface LoginInfo{
    loginState:LoginStateEnum;
    email:string;
}

interface IState{
    loginInfo:LoginInfo
}

const initialState:IState={
    loginInfo:{
        loginState:LoginStateEnum.Normal,
        email:"",
    }
}

export const loginStateReducer = createSlice({
    name:"loginState",
    initialState:initialState,
    reducers:{
        setLoginInfo:(state,action)=>{
            state.loginInfo=action.payload;
        },
        updateLoginState:(state,action)=>{
            state.loginInfo.loginState=action.payload;
        },
        updateLoginEmail:(state,action)=>{
            state.loginInfo.email=action.payload;
        },
    }

})

export const { setLoginInfo,updateLoginState,updateLoginEmail } = loginStateReducer.actions;
export default loginStateReducer.reducer;