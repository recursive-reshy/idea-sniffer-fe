import { createSlice } from '@reduxjs/toolkit'

export type ThemeMode = 'dark' | 'light'

const getInitialThemeMode = (): ThemeMode =>
  localStorage.getItem( 'themeMode' ) == 'light' ? 'light' : 'dark'

const uiSlice = createSlice( {
  name: 'ui',
  initialState: {
    themeMode: getInitialThemeMode()
  },
  reducers: {
    toggleTheme: ( state ) => {
      state.themeMode = state.themeMode == 'dark' ? 'light' : 'dark'
    }
  }
} )

export const { toggleTheme } = uiSlice.actions

export default uiSlice.reducer
