import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

// Normalised Error Shape
// Every error that leaves this base query — whether it's a network failure,
// an HTTP 4xx/5xx from NestJS, or an unexpected thrown value is normalised into this shape.
// `userMessage` is intentionally pre-formatted so a future toast layer can
// consume it directly without any extra unwrapping.
export interface NormalisedError {
  status: number | 'NETWORK_ERROR' | 'PARSE_ERROR' | 'UNKNOWN_ERROR'
  message: string       // raw message for logging / debugging
  userMessage: string   // display-ready message for the UI layer
  data?: unknown        // original response body, if any
}

// NestJS Error Body
// NestJS returns HTTP errors in this shape by default.
// We try to extract `message` from it before falling back to a generic string.
interface NestErrorBody {
  statusCode?: number
  message?: string | string[]
  error?: string
}

function extractNestMessage( body: unknown ): string | null {
  if ( !body || typeof body != 'object' ) return null

  const nest = body as NestErrorBody
  if ( Array.isArray( nest.message ) ) return nest.message[0] ?? null
  if ( typeof nest.message == 'string' ) return nest.message

  return null
}

// User facing Message Map
// Maps HTTP status codes to plain English messages a solo founder will
// actually understand when something goes wrong mid-pipeline.

function toUserMessage( status: NormalisedError[ 'status' ], message: string ): string {
  switch ( status ) {
    case 'NETWORK_ERROR':
      return 'Cannot reach the backend'
    case 'PARSE_ERROR':
      return 'The server returned a response that could not be parsed.'
    case 400:
      return `Bad request: ${ message }`
    case 404:
      return 'Resource not found'
    case 429:
      return 'Rate limited — too many requests. Slow down the polling interval.'
    case 500:
      return 'Internal server error.'
    case 503:
      return 'The server is unavailable. Bright Data or Supabase may be down.'
    default:
      return message || 'An unexpected error occurred.'
  }
}

// Base fetchBaseQuery Instance
const rawBaseQuery = fetchBaseQuery( {
  baseUrl: `${ import.meta.env.VITE_API_BASE_URL }/api/${ import.meta.env.VITE_API_VERSION }`,
} )

// Custom Base
export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  NormalisedError
> = async ( args, api, extraOptions ) => {
  const endpoint = typeof args == 'string' ? args : args.url

  console.debug( `[api] → ${ typeof args == 'string' ? 'GET' : ( args.method ?? 'GET' ) } ${ endpoint }` )

  const result = await rawBaseQuery( args, api, extraOptions )

  if ( !result.error ) {
    return { data: result.data, meta: result.meta }
  }
  // Error normalisation
  const raw = result.error as FetchBaseQueryError
  let normalised: NormalisedError

  if ( raw.status == 'FETCH_ERROR' ) {
    // Network-level failure — server unreachable, CORS, etc.
    normalised = {
      status: 'NETWORK_ERROR',
      message: ( raw.error as string ) ?? 'Network error',
      userMessage: toUserMessage( 'NETWORK_ERROR', '' ),
    }
  } else if ( raw.status == 'PARSING_ERROR' ) {
    normalised = {
      status: 'PARSE_ERROR',
      message: raw.error ?? 'Parse error',
      userMessage: toUserMessage( 'PARSE_ERROR', '' ),
      data: raw.originalStatus,
    }
  } else if ( typeof raw.status == 'number' ) {
    // HTTP error response from NestJS
    const nestMessage = extractNestMessage( raw.data ) ?? `HTTP ${ raw.status }`

    normalised = {
      status: raw.status,
      message: nestMessage,
      userMessage: toUserMessage( raw.status, nestMessage ),
      data: raw.data,
    }
  } else {
    // Catch-all for anything RTK Query emits that we haven't explicitly handled
    normalised = {
      status: 'UNKNOWN_ERROR',
      message: JSON.stringify( raw ),
      userMessage: toUserMessage( 'UNKNOWN_ERROR', '' ),
    }
  }

  console.warn( `[api] ✕ ${ endpoint } — ${ normalised.status }: ${ normalised.message }`)

  return { error: normalised }
}