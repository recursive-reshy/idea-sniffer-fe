import { describe, it, expect } from 'vitest'
import reducer, {
  toggleTheme,
  setPreFilterMode,
  setMinPainScore,
  setCategory,
  setMarketSize,
  setSubreddit,
  setSortBy,
} from './uiSlice'

const initialState = reducer( undefined, { type: '@@INIT' } )

describe( 'uiSlice — initial state', () => {
  it( 'has all six fields with correct defaults', () => {
    expect( initialState ).toEqual( {
      themeMode: 'dark',
      preFilterMode: 'LENIENT',
      minPainScore: 1,
      category: 'all',
      marketSize: 'all',
      subreddit: '',
      sortBy: 'painScore',
    } )
  } )
} )

describe( 'uiSlice — toggleTheme', () => {
  it( 'dark → light', () => {
    const state = { ...initialState, themeMode: 'dark' as const }
    expect( reducer( state, toggleTheme() ).themeMode ).toBe( 'light' )
  } )

  it( 'light → dark', () => {
    const state = { ...initialState, themeMode: 'light' as const }
    expect( reducer( state, toggleTheme() ).themeMode ).toBe( 'dark' )
  } )
} )

describe( 'uiSlice — action creators', () => {
  it( 'setPreFilterMode sets STRICT', () => {
    expect( reducer( initialState, setPreFilterMode( 'STRICT' ) ).preFilterMode ).toBe( 'STRICT' )
  } )

  it( 'setMinPainScore sets 7', () => {
    expect( reducer( initialState, setMinPainScore( 7 ) ).minPainScore ).toBe( 7 )
  } )

  it( 'setCategory sets broken_workflow', () => {
    expect( reducer( initialState, setCategory( 'broken_workflow' ) ).category ).toBe( 'broken_workflow' )
  } )

  it( 'setMarketSize sets large', () => {
    expect( reducer( initialState, setMarketSize( 'large' ) ).marketSize ).toBe( 'large' )
  } )

  it( 'setSubreddit sets webdev', () => {
    expect( reducer( initialState, setSubreddit( 'webdev' ) ).subreddit ).toBe( 'webdev' )
  } )

  it( 'setSortBy sets painScore', () => {
    expect( reducer( initialState, setSortBy( 'painScore' ) ).sortBy ).toBe( 'painScore' )
  } )
} )

describe( 'uiSlice — immutability', () => {
  it( 'does not mutate the original state', () => {
    const state = { ...initialState }
    const frozen = Object.freeze( { ...state } )
    expect( () => reducer( frozen, toggleTheme() ) ).not.toThrow()
  } )
} )
