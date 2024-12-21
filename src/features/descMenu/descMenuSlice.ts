import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IDeskMenue {
    pointId?: string
}

const initState: IDeskMenue = {
    pointId: undefined
};

const descMenuSlice = createSlice({
    name: 'descMenu',
    initialState: initState,
    reducers: {
        PointSet: (state, action: PayloadAction<string>) => {
            const pointId = action.payload;
            state.pointId = pointId;
        },
        PointClear: (state) => {
            state.pointId = undefined;
        }
    },
    selectors: {
        selectIsPointData: state => state.pointId == null,
        selectPointData: state => state.pointId
    }
})

export const {
    PointSet, 
    PointClear 
} = descMenuSlice.actions

export const {
    selectIsPointData,
    selectPointData
} = descMenuSlice.selectors

export default descMenuSlice.reducer