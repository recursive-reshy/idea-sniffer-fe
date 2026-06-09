import { baseApi } from '@api/baseApi'
import { DISTILL_ENDPOINTS } from '@api/apiEndpoints'
import type { PaginatedResponse, SilverSignal, DistillResult } from '../../types/signal.types'

interface SilverSignalParams {
  provider: string
  minPainScore?: number
  page?: number
  limit?: number
}

const distillApi = baseApi.injectEndpoints( {
  endpoints: ( builder ) => ( {
    getSilverSignals: builder.query<PaginatedResponse<SilverSignal>, SilverSignalParams>( {
      query: ( { provider, minPainScore, page, limit } ) => ( {
        url: DISTILL_ENDPOINTS.GET_SILVER_RECORDS,
        params: { provider, minPainScore, page, limit }
      } ),
      serializeQueryArgs: ( { queryArgs: { provider, minPainScore } } ) => ( {
        provider,
        minPainScore
      } ),
      merge: ( cache, incoming ) => {
        cache.data.push( ...incoming.data )
        cache.meta = incoming.meta
      },
      forceRefetch: ( { currentArg, previousArg } ) =>
        currentArg?.page !== previousArg?.page
    } ),

    postDistill: builder.mutation<DistillResult, unknown>( {
      query: ( body ) => ( {
        url: DISTILL_ENDPOINTS.POST_SILVER_RECORDS,
        method: 'POST',
        body
      } )
    } )
  } ),
  overrideExisting: false
} )

export const {
  usePostDistillMutation,
  useGetSilverSignalsQuery,
  useLazyGetSilverSignalsQuery,
} = distillApi
