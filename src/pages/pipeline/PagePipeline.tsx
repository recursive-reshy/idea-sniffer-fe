// Components
import { PageContainer, RunTab } from '@components/index'
// API
import { useGetRedditRunsQuery } from '@api/runs'

function PagePipeline() {
  const { data: runsData, refetch } = useGetRedditRunsQuery( { provider: 'reddit', page: 1, limit: 20 } )

  return (
    <PageContainer>
      <RunTab runs={ runsData?.data ?? [ ] } refetchRuns={ refetch } />
    </PageContainer>
  )
}

export default PagePipeline
