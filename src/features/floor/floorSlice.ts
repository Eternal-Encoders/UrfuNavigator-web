import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const floorSlice = createSlice({
    name: 'floor',
    initialState: {
        value: 1,
        priority: 0
    },
    reducers: {
        floorSet: (state, action: PayloadAction<{floor: number, priority: number}>) => {
            const floor = action.payload.floor;
            const priority = action.payload.priority;

            if (priority >= state.priority) {
                state.value = floor;
                state.priority = priority;
            }
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