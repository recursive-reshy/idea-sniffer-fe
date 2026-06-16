import { buildApiEndpoints } from './buildApiEndpoints'

export const DISTILL_ENDPOINTS = buildApiEndpoints( {
  GET_SILVER_RECORDS: 'distill',
  POST_SILVER_RECORDS: 'distill'
} )

export const FILTER_ENDPOINTS = buildApiEndpoints( {
  POST_FILTER:     'filter',
  GET_FILTER_RUNS: 'filter'
} )

export const REDDIT_ENDPOINTS = buildApiEndpoints( {
  GET_RUNS:            'reddit/runs',
  POST_RUN:            'reddit/run',
  GET_SNAPSHOT_STATUS: 'reddit/{snapshotId}/status',
  POST_INGEST:         'reddit/{snapshotId}/ingest'
} )