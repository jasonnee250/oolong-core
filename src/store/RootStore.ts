import {configureStore} from "@reduxjs/toolkit";
import globalStateReducer from "@/store/reducer/GlobalStateReducer";
import userStateReducer from "@/store/reducer/UserStateReducer.ts";
import docStateReducer from "@/store/reducer/DocStateReducer.ts";
import docListStateReducer from "@/store/reducer/DocListStateReducer.ts";
import loginStateReducer from "@/store/reducer/LoginStateReducer.ts";
import toolMenuStateReducer from "@/store/reducer/ToolMenuStateReducer.ts";
import selectPropStateReducer from "@/store/reducer/SelectPropStateReducer.ts";


const store=configureStore({
    reducer:{
        globalState:globalStateReducer,
        userState:userStateReducer,
        docState:docStateReducer,
        docListState:docListStateReducer,
        loginState:loginStateReducer,
        toolMenuState:toolMenuStateReducer,
        selectPropState:selectPropStateReducer
    }
});

export default store;

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch= typeof store.dispatch;