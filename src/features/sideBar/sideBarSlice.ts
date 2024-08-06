import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SideBarContent } from "../../utils/interfaces";


const initialState = {
    content: SideBarContent.Institutes,
    prevContent: SideBarContent.Empty
}

const sideBarSlice = createSlice({
    name: 'sideBar',
    initialState,
    reducers: {
        setContent: (state, action: PayloadAction<SideBarContent>) => {
            const content = action.payload
            state.prevContent = state.content
            state.content = content
        },
        setContentNoHistory: (state, action: PayloadAction<SideBarContent>) => {
            const content = action.payload
            state.content = content
        }
    },
    selectors: {
        selectContent: state => state.content,
        selectPrevContent: state => state.prevContent
    }
})

export const { 
    setContent,
    setContentNoHistory
} = sideBarSlice.actions

export const {
    selectContent,
    selectPrevContent
} = sideBarSlice.selectors

export default sideBarSlice.reducer