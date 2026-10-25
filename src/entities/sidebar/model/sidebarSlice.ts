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
    routeOpen: false,
    routeDocked: false,
    routeContent: SideBarContent.Route,
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
            settingsOpen: boolean, campusOpen: boolean, restingHeight: number,
            routeOpen?: boolean, routeContent?: SideBarContent, routeDocked?: boolean
        }>) => {
            Object.assign(state, action.payload);
            state.restoreVersion++;
        },
        finishRouteSearch: state => { state.routeContent = SideBarContent.Route; },
        setRouteContent: (state, action: PayloadAction<SideBarContent>) => {
            state.routeContent = action.payload === SideBarContent.PointsList
                ? SideBarContent.PointsList
                : action.payload === SideBarContent.TypeList
                    ? SideBarContent.TypeList
                    : SideBarContent.Route;
        },
        setRouteDocked: (state, action: PayloadAction<boolean>) => {
            state.routeDocked = action.payload;
            if (action.payload) { state.routeOpen = false; state.routeContent = SideBarContent.Route; }
        },
        setRouteOpen: (state, action: PayloadAction<boolean>) => {
            state.routeOpen = action.payload;
            state.routeContent = SideBarContent.Route;
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
        setMainContent: (state, action: PayloadAction<SideBarContent>) => {
            state.prevContent = state.content;
            state.content = action.payload;
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
        selectPanelExpanded: state => state.panelExpanded || state.settingsOpen || state.campusOpen || state.routeOpen,
        selectCampusOpen: state => state.campusOpen,
        selectSettingsOpen: state => state.settingsOpen,
        selectRouteOpen: state => state.routeOpen,
        selectMainContent: state => state.routeDocked ? SideBarContent.Route : state.content,
        selectContent: state => state.content,
        selectPrevContent: state => state.prevContent
    }
})

export const {
    finishRouteSearch,
    setRouteContent,
    setRouteDocked,
    setMainContent,
    setRouteOpen,
    setPanelExpanded,
    setRestingHeight,
    restorePanel,
    setSettingsOpen,
    setCampusOpen,
    setContent,
    setContentNoHistory
} = sidebarSlice.actions

export const {
    selectRouteOpen,
    selectMainContent,
    selectPanelExpanded,
    selectPanelState,
    selectSettingsOpen,
    selectCampusOpen,
    selectContent,
    selectPrevContent
} = sidebarSlice.selectors
