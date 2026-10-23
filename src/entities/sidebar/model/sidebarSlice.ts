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
            if (action.payload === SideBarContent.Route) {
                if (!state.routeDocked) state.routeOpen = true;
                state.routeContent = SideBarContent.Route; return;
            }
            if (state.routeDocked || state.routeOpen) {
                state.routeContent = [SideBarContent.TypeList, SideBarContent.PointsList].includes(action.payload)
                    ? action.payload : SideBarContent.Route;
                return;
            }
            state.prevContent = state.content
            state.content = action.payload
        },
        setContentNoHistory: (state, action: PayloadAction<SideBarContent>) => {
            if (state.routeDocked || state.routeOpen) { state.routeContent = action.payload; return; }
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
        selectContent: state => state.routeDocked || state.routeOpen ? state.routeContent : state.content,
        selectPrevContent: state => state.routeDocked || state.routeOpen ? SideBarContent.Route : state.prevContent
    }
})

export const {
    finishRouteSearch,
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
