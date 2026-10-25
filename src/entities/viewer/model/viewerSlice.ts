import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Theme {
    Dark = 'dark',
    Light = 'light'
}

interface ScreenSize {
    innerWidth: number | undefined,
    innerHeight: number | undefined
}

const initialState = {
    screen: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
    },
    pageReady: false,
    theme: Theme.Light,
    useGps: false
}

export const viewerSlice = createSlice({
    name: 'viewer',
    initialState,
    reducers: {
        setPageReady: (state, action: PayloadAction<boolean>) => {
            state.pageReady = action.payload;
        },
        setScreenSize: (state, action: PayloadAction<ScreenSize>) => {
            if (action.payload.innerWidth) {
                state.screen.innerWidth = action.payload.innerWidth
            }
            if (action.payload.innerHeight) {
                state.screen.innerHeight = action.payload.innerHeight
            }
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload
        },
        setGps: (state, action: PayloadAction<boolean>) => {
            state.useGps = action.payload
        }
    },
    selectors: {
        selectScreenSize: state => state.screen,
        selectPageReady: state => state.pageReady,
        selectTheme: state => state.theme,
        selectGps: state => state.useGps
    }
})

export const {
    setScreenSize,
    setPageReady,
    setTheme,
    setGps
} = viewerSlice.actions

export const {
    selectScreenSize,
    selectPageReady,
    selectTheme,
    selectGps
} = viewerSlice.selectors
