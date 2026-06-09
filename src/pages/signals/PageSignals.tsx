import { useGetSilverSignalsQuery } from '@api/distill'

function PageSignals() {
  const data = useGetSilverSignalsQuery( {
    provider: 'reddit',
    minPainScore: 6
  } )

  console.log( { data } )
  
  return (
    <div>PageSignals</div>
  )
}

export default PageSignals