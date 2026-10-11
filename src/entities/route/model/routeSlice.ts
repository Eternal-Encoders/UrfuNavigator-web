import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { IGraphPoint } from '@/shared/api';

interface RouteState {
    from?: IGraphPoint,
    to?: IGraphPoint
}

const initialState: RouteState = {
    from: undefined,
    to: undefined
}

export const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        setFromPoint: (state, action: PayloadAction<IGraphPoint>) => {
            state.from = action.payload
        },
        setToPoint: (state, action: PayloadAction<IGraphPoint>) => {
            state.to = action.payload
        },
        clearRoute: (state) => {
            state.from = undefined
            state.to = undefined
        }
    },
    selectors: {
        selectFromPoint: state => state.from,
        selectToPoint: state => state.to,
        selectRoutePoints: state => state
    }
})

export const {
    setFromPoint,
    setToPoint,
    clearRoute
} = routeSlice.actions

export const {
    selectFromPoint,
    selectToPoint,
    selectRoutePoints
} = routeSlice.selectors
