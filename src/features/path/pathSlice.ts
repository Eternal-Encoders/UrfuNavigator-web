import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGraphPoint, IPath } from "../../utils/interfaces";


interface PathPayload {
    from: IGraphPoint,
    to: IGraphPoint
}

const initialState: IPath = {
}

const pathSlice = createSlice({
    name: 'path',
    initialState,
    reducers: {
        getPath: (state, action: PayloadAction<PathPayload>) => {
            // const { from, to } = action.payload
            // if (from.institute == to.institute) {
            //     state[from.institute] = getShortestPath(from, to)
            // } else {

            // }
        }
    },
    selectors: {
    }
})

export const { 

} = pathSlice.actions

export const {
} = pathSlice.selectors

export default pathSlice.reducer