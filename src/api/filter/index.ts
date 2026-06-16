import { baseApi } from '@api/baseApi'
import { FILTER_ENDPOINTS } from '@api/apiEndpoints'
import type {
  FilterRequest,
  FilterResult,
  FilterRun,
  GetFilterRunsParams
} from '@app-types/Pipeline'
import type { PaginatedResponse } from '@app-types/Signal'

const filterApi = baseApi.injectEndpoints( {
  endpoints: ( builder ) => ( {
    postFilter: builder.mutation< FilterResult, FilterRequest >( {
      query: ( body ) => ( {
        url: FILTER_ENDPOINTS.POST_FILTER,
        method: 'POST',
        body
      } )
    } ),

    getFilterRuns: builder.query< PaginatedResponse< FilterRun >, GetFilterRunsParams >( {
      query: ( { runId, page, limit } ) => ( {
        url: FILTER_ENDPOINTS.GET_FILTER_RUNS,
        params: { runId, page, limit }
      } )
    } )
  } ),
  overrideExisting: false
} )

export const {
  usePostFilterMutation,
  useGetFilterRunsQuery
} = filterApi
