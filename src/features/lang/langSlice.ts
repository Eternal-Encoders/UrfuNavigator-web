import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Languages } from "../../utils/interfaces";

const langSlice = createSlice({
    name: 'lang',
    initialState: Languages.Russian,
    reducers: {
        setLang: (_, action: PayloadAction<Languages>) => { 
            return action.payload;
        }
    },
    selectors: {
        selectLang: state => state
    }
})

export const { 
    setLang 
} = langSlice.actions

export const {
    selectLang
} = langSlice.selectors

export default langSlice.reducer