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
    theme: Theme.Light,
    useGps: false
}

export const viewerSlice = createSlice({
    name: 'viewer',
    initialState,
    reducers: {
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
        selectTheme: state => state.theme,
        selectGps: state => state.useGps
    }
})

export const {
    setScreenSize,
    setTheme,
    setGps
} = viewerSlice.actions

export const {
    selectScreenSize,
    selectTheme,
    selectGps
} = viewerSlice.selectors
