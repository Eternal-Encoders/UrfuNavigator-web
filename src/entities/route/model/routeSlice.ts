import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { IGraphPoint } from '@/shared/api';

interface RouteState {
    revision: number,
    from?: IGraphPoint,
    to?: IGraphPoint
}

const initialState: RouteState = {
    revision: 0,
    from: undefined,
    to: undefined
}

export const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        setFromPoint: (state, action: PayloadAction<IGraphPoint>) => {
            state.revision++;
            state.from = action.payload
        },
        setToPoint: (state, action: PayloadAction<IGraphPoint>) => {
            state.revision++;
            state.to = action.payload
        },
        setDefaultFromPoint: (state, action: PayloadAction<{
            point: IGraphPoint, destinationId?: string, revision: number
        }>) => {
            const { point, destinationId, revision } = action.payload;
            if (state.from || state.to?.id !== destinationId
                || state.revision !== revision || point.id === destinationId) return;
            state.from = point;
            state.revision++;
        },
        clearRouteEndpoint: (state, action: PayloadAction<'from' | 'to'>) => {
            state[action.payload] = undefined;
            state.revision++;
        },
        clearRoute: (state) => {
            state.revision++;
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
    setDefaultFromPoint,
    setFromPoint,
    setToPoint,
    clearRouteEndpoint,
    clearRoute
} = routeSlice.actions

export const {
    selectFromPoint,
    selectToPoint,
    selectRoutePoints
} = routeSlice.selectors
