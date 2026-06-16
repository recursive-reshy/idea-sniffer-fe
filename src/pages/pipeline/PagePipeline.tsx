// React
import { useState } from 'react'
// MUI
import { Box, Tab, Tabs } from '@mui/material'
// Components
import { PageContainer, RunTab, FilterTab } from '@components/index'
// API
import { useGetRedditRunsQuery } from '@api/runs'

function PagePipeline() {
  const [ activeTab, setActiveTab ] = useState( 0 )
  const { data: runsData, refetch: refetchRuns } = useGetRedditRunsQuery( { provider: 'reddit', page: 1, limit: 20 } )

  const TABS = [ 'Run scrape', 'Filter haiku' ]

  const completedRuns = ( runsData?.data ?? [] ).filter( ( run ) => run.status == 'COMPLETE' )

  return (
    <PageContainer>
      <Box sx={ { borderBottom: 1, borderColor: 'divider', mb: 2 } }>
        <Tabs value={ activeTab } onChange={ ( _, index ) => setActiveTab( index ) }>
          { TABS.map( ( label, index ) => <Tab key={ index } label={ label } /> ) }
        </Tabs>
      </Box>

      { activeTab == 0 && (
        <RunTab runs={ runsData?.data ?? [] } refetchRuns={ refetchRuns } />
      ) }
      { activeTab == 1 && (
        <FilterTab completedRuns={ completedRuns } />
      ) }
    </PageContainer>
  )
}

export default PagePipeline
