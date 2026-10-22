import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum SideBarContent {
    Institutes = 'institutes',
    ExpandedInstitutes = 'expandedInstitutes',
    Route = 'route',
    TypeList = 'typeList',
    Categories = 'categories',
    PointsList = 'pointsList',
    Empty = 'empty'
}

const initialState = {
    content: SideBarContent.Institutes,
    prevContent: SideBarContent.Empty,
    settingsOpen: false,
    campusOpen: false,
    panelExpanded: false,
    restingHeight: 244,
    restoreVersion: 0
}

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setRestingHeight: (state, action: PayloadAction<number>) => {
            state.restingHeight = action.payload;
        },
        restorePanel: (state, action: PayloadAction<{
            content: SideBarContent, prevContent: SideBarContent,
            settingsOpen: boolean, campusOpen: boolean, restingHeight: number
        }>) => {
            Object.assign(state, action.payload);
            state.restoreVersion++;
        },
        setCampusOpen: (state, action: PayloadAction<boolean>) => {
            state.campusOpen = action.payload;
        },
        setSettingsOpen: (state, action: PayloadAction<boolean>) => {
            state.settingsOpen = action.payload;
        },
        setPanelExpanded: (state, action: PayloadAction<boolean>) => {
            state.panelExpanded = action.payload;
        },
        setContent: (state, action: PayloadAction<SideBarContent>) => {
            state.prevContent = state.content
            state.content = action.payload
        },
        setContentNoHistory: (state, action: PayloadAction<SideBarContent>) => {
            state.content = action.payload
        }
    },
    selectors: {
        selectPanelState: state => state,
        selectPanelExpanded: state => state.panelExpanded || state.settingsOpen || state.campusOpen,
        selectCampusOpen: state => state.campusOpen,
        selectSettingsOpen: state => state.settingsOpen,
        selectContent: state => state.content,
        selectPrevContent: state => state.prevContent
    }
})

export const {
    setPanelExpanded,
    setRestingHeight,
    restorePanel,
    setSettingsOpen,
    setCampusOpen,
    setContent,
    setContentNoHistory
} = sidebarSlice.actions

export const {
    selectPanelExpanded,
    selectPanelState,
    selectSettingsOpen,
    selectCampusOpen,
    selectContent,
    selectPrevContent
} = sidebarSlice.selectors
