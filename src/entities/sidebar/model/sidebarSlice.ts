import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum SideBarContent {
    Institutes = 'institutes',
    Settings = 'settings',
    TypeList = 'typeList',
    PointsList = 'pointsList',
    Empty = 'empty'
}

const initialState = {
    content: SideBarContent.Institutes,
    prevContent: SideBarContent.Empty
}

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setContent: (state, action: PayloadAction<SideBarContent>) => {
            state.prevContent = state.content
            state.content = action.payload
        },
        setContentNoHistory: (state, action: PayloadAction<SideBarContent>) => {
            state.content = action.payload
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
} = sidebarSlice.actions

export const {
    selectContent,
    selectPrevContent
} = sidebarSlice.selectors
