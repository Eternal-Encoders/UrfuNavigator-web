import { createSlice } from "@reduxjs/toolkit";

interface IModals {
    isSearchModal: boolean, 
    isSettingsModal: boolean
}

const initialState: IModals = {
    isSearchModal: false,
    isSettingsModal: false
}

const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        toggleSearchModal: (state) => {
            state.isSearchModal = !state.isSearchModal
        },
        toggleSettingsModal: (state) => {
            state.isSettingsModal = !state.isSettingsModal
        }
    },
    selectors: {
        selectSearchModal: state => state.isSearchModal,
        selectSettingsModal: state => state.isSettingsModal
    }
})

export const { 
    toggleSearchModal,
    toggleSettingsModal
} = modalsSlice.actions

export const {
    selectSearchModal,
    selectSettingsModal
} = modalsSlice.selectors

export default modalsSlice.reducer