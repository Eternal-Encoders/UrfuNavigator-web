import { createListenerMiddleware } from '@reduxjs/toolkit';
import { writeSearchHistory } from '../lib/searchHistoryStorage';
import { pointSearchSlice, rememberPoint } from './pointSearchSlice';

export const searchHistoryMiddleware = createListenerMiddleware();

searchHistoryMiddleware.startListening({
    actionCreator: rememberPoint,
    effect: (_action, api) => {
        const state = api.getState() as RootState;
        writeSearchHistory(pointSearchSlice.selectors.selectRecentPoints(state));
    }
});
