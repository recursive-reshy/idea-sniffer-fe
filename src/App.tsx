import { useSelector } from 'react-redux'
// Components
import { LoadingLinear } from '@components/index'
// Store
import { selectIsApiLoading } from '@store/index'
// Pages
import PageSignals from "@pages/signals/PageSignals"


function App() {
  const isLoading = useSelector( selectIsApiLoading )

  return (
    <>
      <LoadingLinear isLoading={ isLoading } />
      <PageSignals />
    </>
  )
}

export default App
