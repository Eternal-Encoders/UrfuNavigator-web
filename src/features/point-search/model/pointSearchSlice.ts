import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { readSearchHistory } from '../lib/searchHistoryStorage';
import type { IGraphPoint, PointTypes } from '@/shared/api';

export type SearchDirection = 'from' | 'to';
type SearchTarget = SearchDirection | 'browse';

interface SearchQuery {
    name: string,
    type?: PointTypes
}

interface PointSearchState {
    direction: SearchTarget,
    browse: SearchQuery,
    from: SearchQuery,
    to: SearchQuery,
    recentPoints: IGraphPoint[]
}

const initialState: PointSearchState = {
    direction: 'browse',
    browse: { name: '' },
    from: { name: '' },
    to: { name: '' },
    recentPoints: readSearchHistory()
}

export const pointSearchSlice = createSlice({
    name: 'pointSearch',
    initialState,
    reducers: {
        rememberPoint: (state, action: PayloadAction<IGraphPoint>) => {
            state.recentPoints = [action.payload, ...state.recentPoints.filter(p => p.id !== action.payload.id)]
                .slice(0, 5);
        },
        setSearchDirection: (state, action: PayloadAction<SearchTarget>) => {
            state.direction = action.payload
        },
        setSearchName: (state, action: PayloadAction<string>) => {
            state[state.direction] = { name: action.payload }
        },
        setSearchType: (state, action: PayloadAction<{ name: string, type: PointTypes }>) => {
            state[state.direction] = action.payload
        },
        resetSearchQuery: (state) => {
            state[state.direction] = { name: '' }
        }
    },
    selectors: {
        selectRecentPoints: state => state.recentPoints,
        selectSearchDirection: state => state.direction,
        selectActiveSearchQuery: state => state[state.direction]
    }
})

export const {
    setSearchDirection,
    setSearchName,
    setSearchType,
    resetSearchQuery,
    rememberPoint
} = pointSearchSlice.actions

export const {
    selectSearchDirection,
    selectActiveSearchQuery,
    selectRecentPoints
} = pointSearchSlice.selectors
