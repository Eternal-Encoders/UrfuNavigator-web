import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { floorSlice } from '@/entities/floor';
import { selectedPointSlice } from '@/entities/point';
import { routeSlice } from '@/entities/route';
import { sidebarSlice } from '@/entities/sidebar';
import { viewerSlice } from '@/entities/viewer';
import { pointSearchSlice } from '@/features/point-search';
import { baseApi } from '@/shared/api';

const rootReducer = combineSlices(
    baseApi,
    floorSlice,
    selectedPointSlice,
    routeSlice,
    sidebarSlice,
    viewerSlice,
    pointSearchSlice
);

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware)
})

setupListeners(store.dispatch)

declare global {
    type RootState = ReturnType<typeof store.getState>
    type AppDispatch = typeof store.dispatch
    type AppStore = typeof store
}
