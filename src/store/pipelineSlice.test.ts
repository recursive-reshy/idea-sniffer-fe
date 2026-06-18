import { describe, it, expect } from 'vitest'
import reducer, {
  setActiveRunId,
  setActiveSnapshotId,
  setRunStatus,
} from './pipelineSlice'

const initialState = reducer( undefined, { type: '@@INIT' } )

describe( 'pipelineSlice — initial state', () => {
  it( 'has four fields with correct defaults', () => {
    expect( initialState ).toEqual( {
      activeRunId: null,
      activeSnapshotId: null,
      activeFilterJobId: null,
      runStatus: 'idle',
    } )
  } )
} )

describe( 'pipelineSlice — setActiveRunId', () => {
  it( 'sets a run id string', () => {
    expect( reducer( initialState, setActiveRunId( 'run-abc' ) ).activeRunId ).toBe( 'run-abc' )
  } )

  it( 'sets null', () => {
    const state = { ...initialState, activeRunId: 'run-abc' }
    expect( reducer( state, setActiveRunId( null ) ).activeRunId ).toBeNull()
  } )
} )

describe( 'pipelineSlice — setActiveSnapshotId', () => {
  it( 'sets a snapshot id string', () => {
    expect( reducer( initialState, setActiveSnapshotId( 'snp-123' ) ).activeSnapshotId ).toBe( 'snp-123' )
  } )
} )

describe( 'pipelineSlice — setRunStatus transitions', () => {
  it( 'idle → scraping', () => {
    expect( reducer( initialState, setRunStatus( 'scraping' ) ).runStatus ).toBe( 'scraping' )
  } )

  it( 'sets ingesting', () => {
    expect( reducer( initialState, setRunStatus( 'ingesting' ) ).runStatus ).toBe( 'ingesting' )
  } )

  it( 'sets complete', () => {
    expect( reducer( initialState, setRunStatus( 'complete' ) ).runStatus ).toBe( 'complete' )
  } )

  it( 'sets failed', () => {
    expect( reducer( initialState, setRunStatus( 'failed' ) ).runStatus ).toBe( 'failed' )
  } )

  it( 'resets to idle', () => {
    const state = { ...initialState, runStatus: 'complete' as const }
    expect( reducer( state, setRunStatus( 'idle' ) ).runStatus ).toBe( 'idle' )
  } )
} )

describe( 'pipelineSlice — immutability', () => {
  it( 'does not mutate the original state', () => {
    const frozen = Object.freeze( { ...initialState } )
    expect( () => reducer( frozen, setRunStatus( 'scraping' ) ) ).not.toThrow()
  } )
} )
