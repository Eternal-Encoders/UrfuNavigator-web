import { createSlice } from "@reduxjs/toolkit";
import { Languages } from "../../utils/interfaces";

const langSlice = createSlice({
    name: 'lang',
    initialState: Languages.Russian,
    reducers: {
        toggleLang(state) { 
            state = state == Languages.Russian ? Languages.English: Languages.Russian
        }
    },
    selectors: {
        selectLang: state => state
    }
})

export const { 
    toggleLang 
} = langSlice.actions

export const {
    selectLang
} = langSlice.selectors

export default langSlice.reducer