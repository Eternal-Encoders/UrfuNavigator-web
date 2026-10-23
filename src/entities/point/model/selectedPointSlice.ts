import type { IGraphPoint } from '@/shared/api';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SelectedPointState {
    pointId?: string,
    focus?: IGraphPoint,
    focusVersion: number,
    focusAnimate: boolean,
    detailsCollapsed: boolean,
    previewEnabled: boolean
}

const initialState: SelectedPointState = {
    focusVersion: 0, focusAnimate: false, detailsCollapsed: false, previewEnabled: false,
    pointId: undefined
};

export const selectedPointSlice = createSlice({
    name: 'selectedPoint',
    initialState,
    reducers: {
        focusPoint: (state, action: PayloadAction<{ point: IGraphPoint, animate: boolean }>) => {
            state.pointId = action.payload.point.id;
            state.focus = action.payload.point;
            state.focusAnimate = action.payload.animate;
            state.focusVersion++;
            state.previewEnabled = true;
            state.detailsCollapsed = true;
        },
        setDetailsCollapsed: (state, action: PayloadAction<boolean>) => {
            state.detailsCollapsed = state.previewEnabled && action.payload;
        },
        restorePointDetails: (state, action: PayloadAction<{
            pointId: string, previewEnabled: boolean, detailsCollapsed: boolean
        }>) => {
            if (state.pointId !== action.payload.pointId) state.focus = undefined;
            state.pointId = action.payload.pointId;
            state.previewEnabled = action.payload.previewEnabled;
            state.detailsCollapsed = state.previewEnabled && action.payload.detailsCollapsed;
        },
        selectPoint: (state, action: PayloadAction<string>) => {
            if (state.pointId !== action.payload) state.focus = undefined;
            state.pointId = action.payload;
            state.detailsCollapsed = false;
            state.previewEnabled = false;
        },
        clearSelectedPoint: (state) => {
            state.pointId = undefined;
            state.focus = undefined;
            state.detailsCollapsed = false;
            state.previewEnabled = false;
        }
    },
    selectors: {
        selectPointPresentation: state => state,
        selectSelectedPointId: state => state.pointId
    }
})

export const {
    selectPoint,
    focusPoint,
    setDetailsCollapsed,
    restorePointDetails,
    clearSelectedPoint
} = selectedPointSlice.actions

export const {
    selectSelectedPointId,
    selectPointPresentation
} = selectedPointSlice.selectors
