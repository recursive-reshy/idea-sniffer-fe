// React
import { useCallback, useMemo, useRef, useState } from 'react'
// MUI
import { Box, CircularProgress, Typography } from '@mui/material'
// Components
import ListItemsWithMeta from '@components/common/ListItemsWithMeta'
// APIs
import { useGetSilverSignalsQuery } from '@api/distill'
// Hooks
import { useInfiniteScroll } from '@hooks/useInfiniteScroll'

interface SignalListProps {
  provider: string
  minPainScore?: number
}

const PAGE_LIMIT = 10

function SignalList( { provider, minPainScore }: SignalListProps ) {
  const [ currentPage, setCurrentPage ] = useState( 1 )

  const { data, isLoading, isFetching } = useGetSilverSignalsQuery( {
    provider,
    minPainScore,
    page: currentPage,
    limit: PAGE_LIMIT
  } )

  const hasMore = data ? currentPage < data.totalPages : false

  const isFetchingRef = useRef( isFetching )
  isFetchingRef.current = isFetching

  const handleLoadMore = useCallback( () => {
    if ( isFetchingRef.current ) return
    setCurrentPage( ( page ) => page + 1 )
  }, [] )

  const setSentinelRef = useInfiniteScroll( handleLoadMore, hasMore )

  const listItems = useMemo( () => {
    if ( !data ) return []
    return data.data.map( ( {
      painScore,
      painSummary,
      category,
      marketSize,
      evidenceQuotes,
      sourceMeta
    } ) => ( {
      avatar: String( painScore ),
      primary: painSummary,
      tags: [
        { label: category, color: 'primary' as const },
        { label: marketSize, color: 'secondary' as const }
      ],
      secondary: evidenceQuotes[ 0 ],
      meta: [
        sourceMeta.communityName,
        sourceMeta.numUpvotes + ' upvotes',
        sourceMeta.numComments + ' comments'
      ]
    } ) )
  }, [ data ] )

  if ( isLoading ) {
    return (
      <Box sx={ { display: 'flex', justifyContent: 'center', p: 4 } }>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <ListItemsWithMeta listItems={ listItems } />
      { hasMore ? (
        <Box ref={ setSentinelRef } sx={ { display: 'flex', justifyContent: 'center', p: 2 } }>
          { isFetching && <CircularProgress size={ 24 } /> }
        </Box>
      ) : (
        <Typography variant="body2" align="center" color="text.secondary" sx={ { p: 2 } }>
          No more signals
        </Typography>
      ) }
    </>
  )
}

export default SignalList
