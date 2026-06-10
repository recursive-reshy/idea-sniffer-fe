// React
import { useMemo } from 'react'
// Components
import { PageContainer } from '@components/index'
import ListItemsWithMeta from '@components/common/ListItemsWithMeta'
// APIs
import { useGetSilverSignalsQuery } from '@api/distill'

function PageSignals() {
  // TODO: check if cached, and not request unnecessary network calls
  const { data } = useGetSilverSignalsQuery( {
    provider: 'reddit',
    minPainScore: 6,
    page: 1,
    limit: 10
  } )

  // Transform SilverSignal data to ListItemWithMeta format
  const transformSilverSignal = useMemo( () => {
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

  return (
    <PageContainer>
      <ListItemsWithMeta
        listItems={ transformSilverSignal }
      />
    </PageContainer>
  )
}

export default PageSignals