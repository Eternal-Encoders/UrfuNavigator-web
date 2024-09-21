import { createSlice } from '@reduxjs/toolkit';
import { IPath } from '../../utils/interfaces';


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

// eslint-disable-next-line no-empty-pattern
export const { 
    
} = pathSlice.actions

// eslint-disable-next-line no-empty-pattern
export const {
    
} = pathSlice.selectors

export default pathSlice.reducer