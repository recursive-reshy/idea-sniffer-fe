import { buildApiEndpoints } from './buildApiEndpoints'

export const DISTILL_ENDPOINTS = buildApiEndpoints( { 
  GET_SILVER_RECORDS: 'distill?provider',
  POST_SILVER_RECORDS: 'distill'
} )