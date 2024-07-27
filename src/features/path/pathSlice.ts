import { createSlice } from "@reduxjs/toolkit";
import { IPath } from "../../utils/interfaces";


interface PathState {
    [institute: string]: IPath
}

// interface PathPayload {
//     from: IGraphPoint,
//     to: IGraphPoint
// }

const initialState: PathState = {
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