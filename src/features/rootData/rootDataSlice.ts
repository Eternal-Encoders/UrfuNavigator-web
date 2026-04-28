import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Themes } from '../../utils/interfaces';


interface ScreanSize {
    innerWidth: number | undefined,
    innerHeight: number | undefined
}


const initialState = {
    screen: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
    },
    theme: Themes.light,
    useGps: false,
    isTouchScreen: false
}

const rootDataSlice = createSlice({
    name: 'rootData',
    initialState,
    reducers: {
        setScreenSize: (state, action: PayloadAction<ScreanSize>) => {
            if (action.payload.innerWidth) {
                state.screen.innerWidth = action.payload.innerWidth
            }
            if (action.payload.innerHeight) {
                state.screen.innerHeight = action.payload.innerHeight
            }
            
        },
        setTheme: (state, action: PayloadAction<Themes>) => {
            state.theme = action.payload
        },
        setGps: (state, action: PayloadAction<boolean>) => {
            state.useGps = action.payload
        },
        setIsTouchEnabled: (state, action: PayloadAction<boolean>) => {
            state.isTouchScreen = action.payload
        }
    },
    selectors: {
        selectScreenSize: state => state.screen,
        selectTheme: state => state.theme,
        selectGps: state => state.useGps,
        selectIsTouchEnabled: state => state.isTouchScreen
    }
})

export const { 
    setScreenSize,
    setTheme,
    setGps,
    setIsTouchEnabled
} = rootDataSlice.actions

export const {
    selectScreenSize,
    selectTheme,
    selectGps,
    selectIsTouchEnabled
} = rootDataSlice.selectors

export default rootDataSlice.reducer