import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const floorSlice = createSlice({
    name: 'floor',
    initialState: {
        value: 1
    },
    reducers: {
        floorSet: (state, action: PayloadAction<number>) => {
            const floor = action.payload
            state.value = floor
        }
    },
    selectors: {
        selectFloor: state => state.value
    }
})

export const { 
    floorSet 
} = floorSlice.actions

export const {
    selectFloor
} = floorSlice.selectors

export default floorSlice.reducer