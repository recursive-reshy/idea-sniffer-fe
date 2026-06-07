import { useGetSilverSignalsQuery } from '@api/distill'

function PageSignals() {
  const data = useGetSilverSignalsQuery( { } )

  console.log( { data } )
  
  return (
    <div>PageSignals</div>
  )
}

export default PageSignals