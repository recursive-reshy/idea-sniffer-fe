import { baseApi } from '@api/baseApi'
import { DISTILL_ENDPOINTS } from '@api/apiEndpoints'
import type { DistillResult, PaginatedResponse, SilverSignal } from '@app-types/Signal'

interface SilverSignalParams {
  provider: string
  minPainScore?: number
  page?: number
  limit?: number
  sortBy?: 'painScore'
  sortOrder?: 'asc' | 'desc'
}

const distillApi = baseApi.injectEndpoints( {
  endpoints: ( builder ) => ( {
    getSilverSignals: builder.query<PaginatedResponse< SilverSignal >, SilverSignalParams >( {
      query: ( { provider, minPainScore, page, limit, sortBy, sortOrder } ) => ( {
        url: DISTILL_ENDPOINTS.GET_SILVER_RECORDS,
        params: { provider, minPainScore, page, limit, sortBy, sortOrder }
      } ),
      serializeQueryArgs: ( { queryArgs: { provider, minPainScore, sortBy, sortOrder } } ) => ( {
        provider,
        minPainScore,
        sortBy,
        sortOrder
      } ),
      merge: ( cache, incoming ) => {
        cache.data.push( ...incoming.data )
        cache.meta = incoming.meta
      },
      forceRefetch: ( { currentArg, previousArg } ) =>
        currentArg?.page !== previousArg?.page
    } ),

    postDistill: builder.mutation< DistillResult, unknown >( {
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
