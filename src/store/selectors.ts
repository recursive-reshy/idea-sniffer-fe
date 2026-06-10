import type { RootState } from './store'

export const selectIsApiLoading = ( state: RootState ): boolean =>
  Object.values( state.api.queries ).some( ( query ) => query?.status == 'pending' ) ||
  Object.values( state.api.mutations ).some( ( mutation ) => mutation?.status == 'pending' )
