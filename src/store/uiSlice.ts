import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'dark' | 'light'
export type PreFilterMode = 'LENIENT' | 'STRICT'
export type MarketSize = 'all' | 'small' | 'medium' | 'large'

const uiSlice = createSlice( {
  name: 'ui',
  initialState: {
    themeMode: localStorage.getItem( 'themeMode' ) == 'light' ? 'light' : 'dark',
    preFilterMode: 'LENIENT' as PreFilterMode,
    minPainScore: 1,
    category: 'all',
    marketSize: 'all' as MarketSize,
    subreddit: '',
    sortBy: 'painScore' as const
  },
  reducers: {
    toggleTheme: ( state ) => {
      state.themeMode = state.themeMode == 'dark' ? 'light' : 'dark'
    },
    setPreFilterMode: ( state, action: PayloadAction< PreFilterMode > ) => {
      state.preFilterMode = action.payload
    },
    setMinPainScore: ( state, action: PayloadAction< number > ) => {
      state.minPainScore = action.payload
    },
    setCategory: ( state, action: PayloadAction< string > ) => {
      state.category = action.payload
    },
    setMarketSize: ( state, action: PayloadAction< MarketSize > ) => {
      state.marketSize = action.payload
    },
    setSubreddit: ( state, action: PayloadAction< string > ) => {
      state.subreddit = action.payload
    },
    setSortBy: ( state, action: PayloadAction< 'painScore' > ) => {
      state.sortBy = action.payload
    }
  }
} )

export const {
  toggleTheme, setPreFilterMode,
  setMinPainScore, setCategory, setMarketSize, setSubreddit, setSortBy
} = uiSlice.actions

export default uiSlice.reducer