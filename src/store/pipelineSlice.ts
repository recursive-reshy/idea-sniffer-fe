import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type RunStatus = 'idle' | 'scraping' | 'ready' | 'ingesting' | 'complete' | 'failed'

interface PipelineState {
  activeRunId: string | null
  activeSnapshotId: string | null
  activeFilterJobId: string | null
  runStatus: RunStatus
}

const initialState: PipelineState = {
  activeRunId: null,
  activeSnapshotId: null,
  activeFilterJobId: null,
  runStatus: 'idle'
}

const pipelineSlice = createSlice( {
  name: 'pipeline',
  initialState,
  reducers: {
    setActiveRunId: ( state, action: PayloadAction< string | null > ) => {
      state.activeRunId = action.payload
    },
    setActiveSnapshotId: ( state, action: PayloadAction< string | null > ) => {
      state.activeSnapshotId = action.payload
    },
    setRunStatus: ( state, action: PayloadAction< RunStatus > ) => {
      state.runStatus = action.payload
    }
  }
} )

export const { setActiveRunId, setActiveSnapshotId, setRunStatus } = pipelineSlice.actions

export default pipelineSlice.reducer
