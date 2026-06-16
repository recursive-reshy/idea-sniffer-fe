import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'dark' | 'light'
export type PreFilterMode = 'LENIENT' | 'STRICT'

const uiSlice = createSlice( {
  name: 'ui',
  initialState: {
    themeMode: localStorage.getItem( 'themeMode' ) == 'light' ? 'light' : 'dark',
    preFilterMode: 'LENIENT' as PreFilterMode
  },
  reducers: {
    toggleTheme: ( state ) => {
      state.themeMode = state.themeMode == 'dark' ? 'light' : 'dark'
    },
    setPreFilterMode: ( state, action: PayloadAction< PreFilterMode > ) => {
      state.preFilterMode = action.payload
    }
  }
} )

export const { toggleTheme, setPreFilterMode } = uiSlice.actions

export default uiSlice.reducer