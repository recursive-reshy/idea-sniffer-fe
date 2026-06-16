// React
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// MUI
import {
  Alert, Box, Button, FormControl, InputLabel, MenuItem,
  Select, Stack, ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material'
// Components
import ListItemsWithMeta from '@components/common/ListItemsWithMeta'
import LoadingLinear from '@components/common/LoadingLinear'
// API
import { usePostFilterMutation, useGetFilterRunsQuery } from '@api/filter'
// Store
import { setActiveRunId, setPreFilterMode } from '@store/index'
import type { RootState, PreFilterMode } from '@store/index'
// Types
import type { FilterRunStatus, Run } from '@app-types/Pipeline'

interface FilterTabProps {
  completedRuns: Run[]
}

function FilterTab( { completedRuns }: FilterTabProps ) {
  const dispatch = useDispatch()
  const { activeRunId } = useSelector( ( state: RootState ) => state.pipeline )
  const preFilterMode = useSelector( ( state: RootState ) => state.ui.preFilterMode )

  // Default dropdown to activeRunId if it appears in completedRuns; user override wins
  const defaultSelectedRunId = useMemo( () => {
    if ( !activeRunId ) return null
    return completedRuns.some( ( run ) => run.id == activeRunId ) ? activeRunId : null
  }, [ activeRunId, completedRuns ] )

  const [ manualSelectedRunId, setManualSelectedRunId ] = useState< string | null >( null )
  const selectedRunId = manualSelectedRunId ?? defaultSelectedRunId

  const [ triggerTime, setTriggerTime ] = useState< string | null >( null )
  const [ activeFilterRunId, setActiveFilterRunId ] = useState< string | null >( null )
  const [ filterStatus, setFilterStatus ] = useState< FilterRunStatus | 'idle' >( 'idle' )

  const shouldPoll = filterStatus == 'PENDING' || filterStatus == 'RUNNING'
  const isFormDisabled = shouldPoll

  const [ postFilter ] = usePostFilterMutation()

  // Base query: always active when a run is selected (provides data + refetch)
  const { data: filterRunsData, refetch: refetchFilterRuns } = useGetFilterRunsQuery(
    { runId: selectedRunId ?? '', page: 1, limit: 5 },
    { skip: !selectedRunId }
  )

  // Polling subscription: RTK Query deduplicates — shares same cache entry as above
  useGetFilterRunsQuery(
    { runId: selectedRunId ?? '', page: 1, limit: 5 },
    { skip: !selectedRunId || !shouldPoll, pollingInterval: shouldPoll ? 4000 : 0 }
  )

  const handleRunFilter = async () => {
    if ( !selectedRunId ) return
    try {
      const triggerTime = new Date().toISOString()
      setTriggerTime( triggerTime )
      setActiveFilterRunId( null )
      setFilterStatus( 'PENDING' )
      dispatch( setActiveRunId( selectedRunId ) ) 

      await postFilter( { runId: selectedRunId, filterMode: preFilterMode } ).unwrap()

      setFilterStatus( 'COMPLETE' )
      setActiveFilterRunId( null )
      refetchFilterRuns()
    } catch ( error ) {
      console.error( `Error occurred while filtering run ${ selectedRunId }:`, error )
      setFilterStatus( 'FAILED' )
    }
  }

  // Watch polling results and track status of the in-flight FilterRun.
  // Legitimate external data sync — setState calls deferred from React render but
  // unavoidable here since RTK Query polling delivers data via effect-triggered re-renders.
  useEffect( () => {
    if ( !filterRunsData || !triggerTime || filterStatus == 'COMPLETE' || filterStatus == 'FAILED' ) return

    const fresh = filterRunsData.data.find( ( filterRun ) => filterRun.createdAt >= triggerTime )
    if ( !fresh ) return

    const latched = activeFilterRunId ?? fresh.id
    const tracked = filterRunsData.data.find( ( filterRun ) => filterRun.id == latched ) ?? fresh

    if ( !activeFilterRunId ) {
      setActiveFilterRunId( latched )
    }
    setFilterStatus( tracked.status )

    if ( tracked.status == 'COMPLETE' || tracked.status == 'FAILED' ) {
      refetchFilterRuns()
    }
  }, [ filterRunsData, triggerTime, activeFilterRunId, filterStatus ] )

  // Derive the tracked run for displaying completion stats
  const displayedTrackedRun = useMemo( () => {
    if ( !triggerTime || !filterRunsData ) return null
    if ( activeFilterRunId ) return filterRunsData.data.find( ( filterRun ) => filterRun.id == activeFilterRunId ) ?? null
    return filterRunsData.data.find( ( filterRun ) => filterRun.createdAt >= triggerTime ) ?? null
  }, [ triggerTime, activeFilterRunId, filterRunsData ] )

  const filterListItems = useMemo( () => ( filterRunsData?.data ?? [] ).map( ( filterRun ) => ( {
    primary: `${ filterRun.preFilterMode }  ${ filterRun.totalPassed ?? 0 } passed / ${ filterRun.totalDropped ?? 0 } dropped`,
    tags: [
      {
        label: filterRun.status,
        color: filterRun.status == 'COMPLETE' ? 'success' :
               filterRun.status == 'FAILED'   ? 'error'   : 'warning'
      } as const
    ],
    meta: [
      filterRun.startedAt ?? '',
      filterRun.totalCostUsd != null ? `$${ filterRun.totalCostUsd.toFixed( 4 ) }` : ''
    ].filter( Boolean )
  } ) ), [ filterRunsData ] )

  return (
    <Box>
      <Stack spacing={ 2 } sx={ { mb: 3 } }>
        <FormControl fullWidth size="small" disabled={ isFormDisabled }>
          <InputLabel>Select a completed run</InputLabel>
          <Select
            label="Select a completed run"
            value={ selectedRunId ?? '' }
            onChange={ ( e ) => {
              const newId = e.target.value as string
              if ( newId == selectedRunId ) return
              setManualSelectedRunId( newId )
              setTriggerTime( null )
              setActiveFilterRunId( null )
              setFilterStatus( 'idle' )
            } }
          >
            { completedRuns.map( ( run ) => (
              <MenuItem key={ run.id } value={ run.id }>
                { run.snapshotId }{ run.startedAt ? ` — ${ new Date( run.startedAt ).toLocaleDateString() }` : '' }
              </MenuItem>
            ) ) }
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={ preFilterMode }
          exclusive
          onChange={ ( _, newMode: string | null ) => {
            if ( newMode ) dispatch( setPreFilterMode( newMode as PreFilterMode ) )
          } }
          disabled={ isFormDisabled }
          size="small"
        >
          <ToggleButton value="LENIENT">Lenient</ToggleButton>
          <ToggleButton value="STRICT">Strict</ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          onClick={ handleRunFilter }
          disabled={ !selectedRunId || isFormDisabled }
        >
          Run Filter
        </Button>
      </Stack>

      { filterStatus == 'PENDING' && (
        <Box sx={ { mb: 2 } }>
          <Typography variant="body2" color="text.secondary">Queuing filter...</Typography>
          <LoadingLinear isLoading />
        </Box>
      ) }

      { filterStatus == 'RUNNING' && (
        <Box sx={ { mb: 2 } }>
          <Typography variant="body2" color="text.secondary">Classifying records with Haiku...</Typography>
          <LoadingLinear isLoading />
        </Box>
      ) }

      { filterStatus == 'COMPLETE' && (
        <Alert severity="success" sx={ { mb: 2 } }>
          { displayedTrackedRun ? 
            `${ displayedTrackedRun.totalPassed } passed · ${ displayedTrackedRun.totalDropped } dropped${ displayedTrackedRun.totalCostUsd != null ? ` · $${ displayedTrackedRun.totalCostUsd.toFixed( 4 ) }` : '' }`
          : 
            'Filter complete.'
          }
        </Alert>
      ) }

      { filterStatus == 'FAILED' && (
        <Alert
          sx={ { mb: 2 } }
          severity="error"
          action={ 
            <Button
              color="inherit"
              size="small"
              onClick={ handleRunFilter }
            >
              Retry
            </Button> 
          }
        >
          Filter run failed
        </Alert>
      ) }

      <ListItemsWithMeta listItems={ filterListItems } />
    </Box>
  )
}

export default FilterTab
