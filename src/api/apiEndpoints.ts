import { buildApiEndpoints } from './buildApiEndpoints'

export const DISTILL_ENDPOINTS = buildApiEndpoints( { 
  GET_SILVER_RECORDS: 'distill?provider={provider}&minScore={minScore}',
  POST_SILVER_RECORDS: 'distill'
} )