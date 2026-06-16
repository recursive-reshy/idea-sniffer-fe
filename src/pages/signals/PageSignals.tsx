// React
import { useSelector } from 'react-redux'
// Components
import { PageContainer, SignalFilters, SignalList } from '@components/index'
// API
import { useGetSilverSignalsQuery } from '@api/distill'
// Store
import type { RootState } from '@store/index'

function PageSignals() {
  const { minPainScore, sortBy } = useSelector( ( state: RootState ) => state.ui )

  const { data } = useGetSilverSignalsQuery( { provider: 'reddit', minPainScore, sortBy, page: 1, limit: 10 } )

  return (
    <PageContainer>
      <SignalFilters signalCount={ data?.total } />
      <SignalList key={ `${ minPainScore }-${ sortBy }` } provider="reddit" minPainScore={ minPainScore } sortBy={ sortBy } />
    </PageContainer>
  )
}

export default PageSignals
