import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// rawBaseQuery is created at module init by calling fetchBaseQuery(...).
// Hoist a stable mock so we can control its return value per-test.
const rawBaseQuery = vi.hoisted( () => vi.fn() )

vi.mock( '@reduxjs/toolkit/query/react', async ( importOriginal ) => {
  const actual = await importOriginal<typeof import( '@reduxjs/toolkit/query/react' )>()
  return {
    ...actual,
    fetchBaseQuery: () => rawBaseQuery,
  }
} )

import { customBaseQuery } from './customBaseQuery'
import type { NormalisedError } from './customBaseQuery'

const mockApi = {
  signal: new AbortController().signal,
  dispatch: vi.fn(),
  getState: vi.fn(),
  extra: undefined,
  endpoint: 'test',
  type: 'query' as const,
  forced: false,
  abort: vi.fn(),
}

describe( 'customBaseQuery', () => {
  beforeEach( () => {
    vi.spyOn( console, 'warn' ).mockImplementation( () => {} )
    vi.spyOn( console, 'debug' ).mockImplementation( () => {} )
    rawBaseQuery.mockReset()
  } )

  afterEach( () => {
    vi.restoreAllMocks()
  } )

  it( 'returns data on a successful 200 response', async () => {
    rawBaseQuery.mockResolvedValue( { data: { id: 1 }, meta: {} } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    expect( result ).toEqual( { data: { id: 1 }, meta: {} } )
    expect( 'error' in result ).toBe( false )
  } )

  it( 'FETCH_ERROR → NETWORK_ERROR with correct userMessage', async () => {
    rawBaseQuery.mockResolvedValue( {
      error: { status: 'FETCH_ERROR', error: 'Failed to fetch' },
    } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    const error = ( result as { error: NormalisedError } ).error
    expect( error.status ).toBe( 'NETWORK_ERROR' )
    expect( error.userMessage ).toContain( 'Cannot reach the backend' )
  } )

  it( 'HTTP 400 with string message', async () => {
    rawBaseQuery.mockResolvedValue( {
      error: { status: 400, data: { message: 'bad input' } },
    } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    const error = ( result as { error: NormalisedError } ).error
    expect( error.status ).toBe( 400 )
    expect( error.userMessage ).toContain( 'Bad request' )
  } )

  it( 'HTTP 400 with array message', async () => {
    rawBaseQuery.mockResolvedValue( {
      error: { status: 400, data: { message: [ 'field required' ] } },
    } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    const error = ( result as { error: NormalisedError } ).error
    expect( error.status ).toBe( 400 )
    expect( error.userMessage ).toContain( 'Bad request' )
  } )

  it( 'HTTP 404', async () => {
    rawBaseQuery.mockResolvedValue( {
      error: { status: 404, data: {} },
    } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    const error = ( result as { error: NormalisedError } ).error
    expect( error.status ).toBe( 404 )
    expect( error.userMessage ).toContain( 'Resource not found' )
  } )

  it( 'HTTP 429', async () => {
    rawBaseQuery.mockResolvedValue( {
      error: { status: 429, data: {} },
    } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    const error = ( result as { error: NormalisedError } ).error
    expect( error.status ).toBe( 429 )
    expect( error.userMessage ).toContain( 'Rate limited' )
  } )

  it( 'HTTP 500', async () => {
    rawBaseQuery.mockResolvedValue( {
      error: { status: 500, data: {} },
    } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    const error = ( result as { error: NormalisedError } ).error
    expect( error.status ).toBe( 500 )
    expect( error.userMessage ).toContain( 'Internal server error' )
  } )

  it( 'HTTP 503', async () => {
    rawBaseQuery.mockResolvedValue( {
      error: { status: 503, data: {} },
    } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    const error = ( result as { error: NormalisedError } ).error
    expect( error.status ).toBe( 503 )
    expect( error.userMessage ).toContain( 'unavailable' )
  } )

  it( 'unknown HTTP status (418) falls back to raw message', async () => {
    rawBaseQuery.mockResolvedValue( {
      error: { status: 418, data: { message: "I'm a teapot" } },
    } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    const error = ( result as { error: NormalisedError } ).error
    expect( error.status ).toBe( 418 )
    expect( error.userMessage ).toContain( "I'm a teapot" )
  } )

  it( 'PARSING_ERROR → PARSE_ERROR with correct userMessage', async () => {
    rawBaseQuery.mockResolvedValue( {
      error: { status: 'PARSING_ERROR', error: 'Unexpected token', originalStatus: 200 },
    } )
    const result = await customBaseQuery( '/test', mockApi, {} )
    const error = ( result as { error: NormalisedError } ).error
    expect( error.status ).toBe( 'PARSE_ERROR' )
    expect( error.userMessage ).toContain( 'could not be parsed' )
  } )
} )
