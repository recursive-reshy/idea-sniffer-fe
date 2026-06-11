import { baseApi } from '@api/baseApi'
import { REDDIT_ENDPOINTS } from '@api/apiEndpoints'
import type {
  RedditRunRequest,
  RedditRunResponse,
  SnapshotStatusResponse,
  IngestSnapshotRequest,
  IngestSnapshotResponse,
  Run,
  GetRedditRunsParams
} from '@app-types/Pipeline'
import type { PaginatedResponse } from '@app-types/Signal'

const runsApi = baseApi.injectEndpoints( {
  endpoints: ( builder ) => ( {
    getRedditRuns: builder.query< PaginatedResponse< Run >, GetRedditRunsParams >( {
      query: ( { provider, page, limit } ) => ( {
        url: REDDIT_ENDPOINTS.GET_RUNS,
        params: { provider, page, limit }
      } )
    } ),

    postRedditRun: builder.mutation< RedditRunResponse, RedditRunRequest >( {
      query: ( body ) => ( {
        url: REDDIT_ENDPOINTS.POST_RUN,
        method: 'POST',
        body
      } )
    } ),

    getSnapshotStatus: builder.query< SnapshotStatusResponse, string >( {
      query: ( snapshotId ) => ( {
        url: REDDIT_ENDPOINTS.GET_SNAPSHOT_STATUS.replace( '{snapshotId}', snapshotId )
      } )
    } ),

    postIngestSnapshot: builder.mutation< IngestSnapshotResponse, { snapshotId: string, body: IngestSnapshotRequest } >( {
      query: ( { snapshotId, body } ) => ( {
        url: REDDIT_ENDPOINTS.POST_INGEST.replace( '{snapshotId}', snapshotId ),
        method: 'POST',
        body
      } )
    } )
  } ),
  overrideExisting: false
} )

export const {
  useGetRedditRunsQuery,
  usePostRedditRunMutation,
  useGetSnapshotStatusQuery,
  usePostIngestSnapshotMutation
} = runsApi
