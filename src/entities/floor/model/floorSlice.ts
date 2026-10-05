import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const floorSlice = createSlice({
    name: 'floor',
    initialState: {
        value: '',
        priority: 0
    },
    reducers: {
        floorSet: (state, action: PayloadAction<{floor: string, priority: number}>) => {
            const { floor, priority } = action.payload;

            if (priority >= state.priority) {
                state.value = floor;
                state.priority = priority;
            }
        },
        floorReset: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
            state.priority = 0;
        }
    },
    selectors: {
        selectFloor: state => state.value
    }
})

export const {
    floorSet,
    floorReset
} = floorSlice.actions

export const {
    selectFloor
} = floorSlice.selectors
