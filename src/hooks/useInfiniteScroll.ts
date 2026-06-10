import { useCallback, useEffect, useRef } from 'react'

export function useInfiniteScroll( onLoadMore: () => void, hasMore: boolean ) {
  const observerRef = useRef<IntersectionObserver | null>( null )

  const setSentinelRef = useCallback( ( node: Element | null ) => {
    observerRef.current?.disconnect()

    if ( !node || !hasMore ) return

    observerRef.current = new IntersectionObserver( ( [ entry ] ) => {
      if ( entry.isIntersecting ) {
        onLoadMore()
      }
    }, { rootMargin: '200px' } )

    observerRef.current.observe( node )
  }, [ onLoadMore, hasMore ] )

  useEffect( () => () => observerRef.current?.disconnect(), [] )

  return setSentinelRef
}
