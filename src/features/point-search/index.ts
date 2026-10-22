import { lazy } from 'react';

export {
    pointSearchSlice,
    setSearchDirection,
    type SearchDirection
} from './model/pointSearchSlice';
export { useSelectPoint } from './model/useSelectPoint';
export { SearchTrigger } from './ui/SearchTrigger';
export { SearchBar } from './ui/SearchBar';
export const SearchResults = lazy(() => import('./ui/SearchResults').then(module => ({ default: module.SearchResults })));
export { QuickTypes } from './ui/QuickTypes';
export { SearchHistory } from './ui/SearchHistory';
export { searchHistoryMiddleware } from './model/searchHistoryMiddleware';
