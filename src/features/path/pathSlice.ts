import { createSlice } from "@reduxjs/toolkit";
import { IPath } from "../../utils/interfaces";


// interface PathPayload {
//     from: IGraphPoint,
//     to: IGraphPoint
// }

const initialState: IPath = {
}

const pathSlice = createSlice({
    name: 'path',
    initialState,
    reducers: {
    },
    selectors: {
    }
})

export const { 

} = pathSlice.actions

export const {
} = pathSlice.selectors

export default pathSlice.reducer