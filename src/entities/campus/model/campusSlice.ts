import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const CAMPUSES = [
    { id: 'mira', label: 'CampusMira', building: 'guk', center: [56.842, 60.652], available: true },
    { id: 'lenina', label: 'CampusLenina', building: 'ugi', center: [56.840429, 60.616079], available: true },
    { id: 'kuibysheva', label: 'CampusKuibysheva', building: 'ienim', center: null, available: false },
    { id: 'novokoltsovsky', label: 'CampusNovokoltsovsky', building: 'irit-rtf', center: null, available: false }
] as const;
export type CampusId = typeof CAMPUSES[number]['id'];
export const campusSlice = createSlice({
    name: 'campus',
    initialState: { selected: 'mira' as CampusId, version: 0 },
    reducers: {
        selectCampus: (state, action: PayloadAction<CampusId>) => {
            if (!CAMPUSES.some(campus => campus.id === action.payload && campus.available)) return;
            state.selected = action.payload;
            state.version++;
        }
    },
    selectors: { selectCampusState: state => state }
});
export const { selectCampus } = campusSlice.actions;
export const { selectCampusState } = campusSlice.selectors;
