// React
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// MUI
import { Alert, Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
// Components
import ListItemsWithMeta from '@components/common/ListItemsWithMeta'
import LoadingLinear from '@components/common/LoadingLinear'
// API
import { usePostRedditRunMutation, useGetSnapshotStatusQuery, usePostIngestSnapshotMutation } from '@api/runs'
import type { NormalisedError } from '@api/customBaseQuery'
// Store
import { setActiveRunId, setActiveSnapshotId, setRunStatus } from '@store/index'
import type { RootState } from '@store/index'
// Types
import type { Run, OptimisticRun } from '@app-types/Pipeline'

interface RunTabProps {
  runs: Run[]
  refetchRuns: () => void
}

const deriveDuration = ( startedAt: string | null, completedAt: string | null ): string => {
  if ( !startedAt || !completedAt ) return ''
  const ms = new Date( completedAt ).getTime() - new Date( startedAt ).getTime()
  const s = Math.floor( ms / 1000 )
  const m = Math.floor( s / 60 )
  return m > 0 ? `${ m }m ${ s % 60 }s` : `${ s }s`
}

function RunTab( { runs, refetchRuns }: RunTabProps ) {
  const dispatch = useDispatch()
  const { activeRunId, activeSnapshotId, runStatus } = useSelector( ( state: RootState ) => state.pipeline )

  const [ subreddits, setSubreddits ] = useState< string[] >( [ '' ] )
  const [ optimisticRuns, setOptimisticRuns ] = useState< OptimisticRun[] >( [ ] )
  const [ errorMessage, setErrorMessage ] = useState< string | null >( null )

  const [ postRedditRun, { isLoading: isStarting } ] = usePostRedditRunMutation()
  const [ postIngestSnapshot ] = usePostIngestSnapshotMutation()

  const { data: statusData } = useGetSnapshotStatusQuery( activeSnapshotId ?? '', {
    skip: !activeSnapshotId || runStatus !== 'scraping',
    pollingInterval: runStatus === 'scraping' ? 5000 : 0
  } )

  const isFormDisabled = runStatus === 'scraping' || runStatus === 'ingesting' || runStatus === 'failed'

  const updateOptimisticRunByLocalId = ( localId: string, updates: Partial< OptimisticRun > ) => {
    setOptimisticRuns( ( prev ) => prev.map( ( run ) => run.localId === localId ? { ...run, ...updates } : run ) )
  }

  const updateOptimisticRunBySnapshotId = ( snapshotId: string, updates: Partial< OptimisticRun > ) => {
    setOptimisticRuns( ( prev ) => prev.map( ( run ) => run.snapshotId === snapshotId ? { ...run, ...updates } : run ) )
  }

  const handleSubredditChange = ( index: number, value: string ) => {
    setSubreddits( ( prev ) => prev.map( ( s, i ) => i === index ? value : s ) )
  }

  const handleAddSubreddit = () => {
    setSubreddits( ( prev ) => [ ...prev, '' ] )
  }

  const handleRemoveSubreddit = ( index: number ) => {
    setSubreddits( ( prev ) => prev.filter( ( _, i ) => i !== index ) )
  }

  const handleStartRun = async () => {
    setErrorMessage( null )
    const cleanedSubreddits = subreddits.map( ( s ) => s.trim() ).filter( Boolean )
    const localId = String( Date.now() )

    setOptimisticRuns( ( prev ) => [
      {
        localId,
        snapshotId: 'pending...',
        subreddits: cleanedSubreddits,
        status: 'scraping',
        startedAt: new Date().toISOString()
      },
      ...prev
    ] )

    try {
      const { runId, snapshotId } = await postRedditRun( { subreddits: cleanedSubreddits } ).unwrap()

      updateOptimisticRunByLocalId( localId, { snapshotId } )

      dispatch( setActiveRunId( runId ) )
      dispatch( setActiveSnapshotId( snapshotId ) )
      dispatch( setRunStatus( 'scraping' ) )
    } catch ( error ) {
      setErrorMessage( ( error as NormalisedError )?.userMessage ?? 'Failed to start run' )
      updateOptimisticRunByLocalId( localId, { status: 'failed' } )
      dispatch( setRunStatus( 'failed' ) )
    }
  }

  const handleRetry = () => {
    setErrorMessage( null )
    if ( activeSnapshotId ) updateOptimisticRunBySnapshotId( activeSnapshotId, { status: 'failed' } )
    dispatch( setRunStatus( 'idle' ) )
  }

  // Watch polling result
  useEffect( () => {
    if ( !statusData ) return

    if ( statusData.status === 'ready' ) {
      dispatch( setRunStatus( 'ready' ) )
    } else if ( statusData.status === 'failed' ) {
      dispatch( setRunStatus( 'failed' ) )
      refetchRuns()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ statusData, dispatch ] )

  // Auto-ingest once the snapshot is ready
  useEffect( () => {
    if ( runStatus !== 'ready' ) return

    dispatch( setRunStatus( 'ingesting' ) )

    const ingest = async () => {
      try {
        const result = await postIngestSnapshot( {
          snapshotId: activeSnapshotId ?? '',
          body: { runId: activeRunId ?? '' }
        } ).unwrap()

        dispatch( setRunStatus( 'complete' ) )
        setOptimisticRuns( ( prev ) => prev.map( ( run ) =>
          run.snapshotId === activeSnapshotId
            ? { ...run, status: 'complete', totalStored: result.stored, totalSkipped: result.skipped, elapsed: result.elapsed }
            : run
        ) )
        refetchRuns()
      } catch ( error ) {
        setErrorMessage( ( error as NormalisedError )?.userMessage ?? 'Failed to ingest snapshot' )
        dispatch( setRunStatus( 'failed' ) )
        setOptimisticRuns( ( prev ) => prev.map( ( run ) =>
          run.snapshotId === activeSnapshotId ? { ...run, status: 'failed' } : run
        ) )
        refetchRuns()
      }
    }

    ingest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ runStatus ] )

  const allRuns = useMemo( () => {
    const persistedSnapshotIds = new Set( runs.map( ( run ) => run.snapshotId ) )
    const visibleOptimisticRuns = optimisticRuns.filter( ( run ) =>
      run.snapshotId === 'pending...' || !persistedSnapshotIds.has( run.snapshotId )
    )
    return [ ...visibleOptimisticRuns, ...runs ]
  }, [ optimisticRuns, runs ] )

  const listItems = useMemo( () => allRuns.map( ( run ) => {
    const isOptimistic = 'localId' in run

    const subreddits = isOptimistic
      ? ( run as OptimisticRun ).subreddits
      : ( run as Run ).subreddit?.split( ',' ) ?? [ ]

    const snapshotId = isOptimistic
      ? ( run as OptimisticRun ).snapshotId
      : ( run as Run ).snapshotId

    const baseStatus = isOptimistic
      ? ( run as OptimisticRun ).status
      : ( run as Run ).status.toLowerCase()

    const status = snapshotId === activeSnapshotId && runStatus !== 'idle' ? runStatus : baseStatus

    const postCount = isOptimistic
      ? ( run as OptimisticRun ).totalStored
      : ( run as Run ).totalStored

    const startedAt = isOptimistic
      ? ( run as OptimisticRun ).startedAt
      : ( run as Run ).startedAt ?? ''

    const elapsed = isOptimistic
      ? ( run as OptimisticRun ).elapsed
      : deriveDuration( ( run as Run ).startedAt, ( run as Run ).completedAt )

    return {
      primary: [
        snapshotId,
        postCount != null ? `${ postCount } posts collected` :
        status === 'failed' ? 'scrape failed' : '...'
      ].join( '  ' ),
      tags: [
        {
          label: status.toUpperCase(),
          color: status === 'complete' || status === 'ready' ? 'success' :
                 status === 'failed' ? 'error' : 'warning'
        } as const,
        ...subreddits.map( ( s ) => ( { label: `r/${ s.trim() }`, color: 'default' as const } ) )
      ],
      meta: [ startedAt, elapsed ].filter( Boolean ) as string[]
    }
  } ), [ allRuns, activeSnapshotId, runStatus ] )

  return (
    <Box>
      <Stack spacing={ 2 } sx={ { mb: 3 } }>
        { subreddits.map( ( subreddit, index ) => (
          <Stack key={ index } direction="row" spacing={ 1 } sx={ { alignItems: 'center' } }>
            <TextField
              label={ `Subreddit ${ index + 1 }` }
              value={ subreddit }
              onChange={ ( e ) => handleSubredditChange( index, e.target.value ) }
              disabled={ isFormDisabled }
              fullWidth
              size="small"
            />
            <IconButton
              onClick={ () => handleRemoveSubreddit( index ) }
              disabled={ isFormDisabled || subreddits.length === 1 }
            >
              <Delete />
            </IconButton>
          </Stack>
        ) ) }

        <Box>
          <Button startIcon={ <Add /> } onClick={ handleAddSubreddit } disabled={ isFormDisabled }>
            Add subreddit
          </Button>
        </Box>

        <Button
          variant="contained"
          onClick={ handleStartRun }
          disabled={ isFormDisabled || isStarting || subreddits.every( ( s ) => !s.trim() ) }
        >
          Start Run
        </Button>
      </Stack>

      { runStatus === 'scraping' &&
        <Box sx={ { mb: 2 } }>
          <Typography variant="body2" color="text.secondary">Scraping subreddits...</Typography>
          <LoadingLinear isLoading />
        </Box>
      }

      { runStatus === 'ingesting' &&
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          Ingesting results...
        </Typography>
      }

      { runStatus === 'failed' &&
        <Alert
          severity="error"
          action={ <Button color="inherit" size="small" onClick={ handleRetry }>Retry</Button> }
          sx={ { mb: 2 } }
        >
          { errorMessage ?? 'Run failed' }
        </Alert>
      }

      <ListItemsWithMeta listItems={ listItems } />
    </Box>
  )
}

export default RunTab
