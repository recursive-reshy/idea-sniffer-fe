import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@api/baseApi'
import pipelineReducer from './pipelineSlice'
import uiReducer from './uiSlice'

export const store = configureStore( {
  reducer: {
    [ baseApi.reducerPath ]: baseApi.reducer,
    pipeline: pipelineReducer,
    ui: uiReducer
  },
  middleware: ( getDefaultMiddleware ) => getDefaultMiddleware().concat( baseApi.middleware)
} )

export type RootState = ReturnType< typeof store.getState >
export type AppDispatch = typeof store.dispatch