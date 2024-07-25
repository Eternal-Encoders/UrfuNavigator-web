import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import langSlice from "../features/lang/langSlice";
import floorSlice from "../features/floor/floorSlice";
import pointsSearchSlice from "../features/pointsSearch/pointsSearchSlice";
import modalsSlice from "../features/modals/modalsSlice";
import pathSlice from "../features/path/pathSlice";

const store = configureStore({
    reducer: {
        lang: langSlice,
        floor: floorSlice,
        pointsSearch: pointsSearchSlice,
        modals: modalsSlice,
        path: pathSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store