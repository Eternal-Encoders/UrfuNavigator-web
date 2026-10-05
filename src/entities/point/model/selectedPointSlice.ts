import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SelectedPointState {
    pointId?: string
}

const initialState: SelectedPointState = {
    pointId: undefined
};

export const selectedPointSlice = createSlice({
    name: 'selectedPoint',
    initialState,
    reducers: {
        selectPoint: (state, action: PayloadAction<string>) => {
            state.pointId = action.payload;
        },
        clearSelectedPoint: (state) => {
            state.pointId = undefined;
        }
    },
    selectors: {
        selectSelectedPointId: state => state.pointId
    }
})

export const {
    selectPoint,
    clearSelectedPoint
} = selectedPointSlice.actions

export const {
    selectSelectedPointId
} = selectedPointSlice.selectors
