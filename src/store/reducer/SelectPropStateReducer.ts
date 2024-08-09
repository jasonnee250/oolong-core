import {createSlice} from "@reduxjs/toolkit";
import {SelectViewProps} from "@/select/view/SelectViewProps.ts";

interface IState {
    selectProp: SelectViewProps,
}

const initialState: IState = {
    selectProp:
        {
            color: "#ffffff",
            fontSize:14,
            fontColor:"#000000",
            borderColor:"#000000",
            borderWidth:1,
        }

}

export const selectPropStateReducer = createSlice({
    name: "selectPropState",
    initialState: initialState,
    reducers: {
        setSelectProps: (state, action) => {
            state.selectProp = action.payload;
        },
    }

})

export const {setSelectProps} = selectPropStateReducer.actions;
export default selectPropStateReducer.reducer;