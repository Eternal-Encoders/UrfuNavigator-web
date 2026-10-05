import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PointTypes } from '@/shared/api';

export type SearchDirection = 'from' | 'to';

interface SearchQuery {
    name: string,
    type?: PointTypes
}

interface PointSearchState {
    direction: SearchDirection,
    from: SearchQuery,
    to: SearchQuery
}

const initialState: PointSearchState = {
    direction: 'from',
    from: { name: '' },
    to: { name: '' }
}

export const pointSearchSlice = createSlice({
    name: 'pointSearch',
    initialState,
    reducers: {
        setSearchDirection: (state, action: PayloadAction<SearchDirection>) => {
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
        selectSearchDirection: state => state.direction,
        selectActiveSearchQuery: state => state[state.direction]
    }
})

export const {
    setSearchDirection,
    setSearchName,
    setSearchType,
    resetSearchQuery
} = pointSearchSlice.actions

export const {
    selectSearchDirection,
    selectActiveSearchQuery
} = pointSearchSlice.selectors
