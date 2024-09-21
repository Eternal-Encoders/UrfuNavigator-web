import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IGraphPoint } from '../../utils/interfaces';

interface IPointsSearch {
    from?: IGraphPoint, 
    to?: IGraphPoint
}

const initialState: IPointsSearch = {
    from: undefined,
    to: undefined
}

const pointsSearchSlice = createSlice({
    name: 'pointsSearch',
    initialState,
    reducers: {
        setFromPoint: (state, action: PayloadAction<IGraphPoint>) => {
            const from = action.payload
            state.from = from
        },
        setToPoint: (state, action: PayloadAction<IGraphPoint>) => {
            const to = action.payload
            state.to = to
        },
        setPoints: (state, action: PayloadAction<IPointsSearch>) => {
            const points = action.payload
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            state.to = points.to,
            state.from = points.from
        }
    },
    selectors: {
        selectFromPoint: state => state.from,
        selectToPoint: state => state.to,
        selectSearchPoints: state => state
    }
})

export const { 
    setFromPoint,
    setToPoint,
    setPoints 
} = pointsSearchSlice.actions

export const {
    selectFromPoint,
    selectToPoint,
    selectSearchPoints
} = pointsSearchSlice.selectors

export default pointsSearchSlice.reducer