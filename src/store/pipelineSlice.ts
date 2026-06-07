import { createSlice } from '@reduxjs/toolkit'

const pipelineSlice = createSlice( { 
  name: 'pipeline',
  initialState: {
    activeSnapshotId: null,
    activeFilter: null
  },
  reducers: {
    setActiveSnapshotId: ( state, action ) => {
      state.activeSnapshotId = action.payload
    },
    setActiveFilter: ( state, action ) => {
      state.activeFilter = action.payload
    }
  }
} )

export const { setActiveSnapshotId, setActiveFilter } = pipelineSlice.actions

export default pipelineSlice.reducer