// Components
import { PageContainer, SignalList } from '@components/index'

function PageSignals() {
  return (
    <PageContainer>
      <SignalList provider="reddit" minPainScore={ 6 } />
    </PageContainer>
  )
}

export default PageSignals
