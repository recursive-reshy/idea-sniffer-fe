import { baseApi } from '@api/baseApi'
import { DISTILL_ENDPOINTS } from '@api/apiEndpoints'

const distillApi = baseApi.injectEndpoints( { 
  endpoints: ( builder ) => ( {
    getSilverSignals: builder.query( {
      query: ( { provider, minScore } ) => ( {
        url: DISTILL_ENDPOINTS.GET_SILVER_RECORDS,
        params: { provider, minScore }
      } )
    } ),

    postDistill: builder.mutation( { 
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