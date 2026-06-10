// MUI
import { AppBar, Toolbar, Tabs, Tab, Typography, Box, IconButton } from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'
// Router
import { useLocation, useNavigate } from 'react-router-dom'
// Redux
import { useDispatch, useSelector } from 'react-redux'
// Store
import { toggleTheme, selectThemeMode } from '@store/index'
import type { RootState } from '@store/index'

const NAV_TABS = [
  { label: 'Pipeline', path: '/pipeline' },
  { label: 'Signals', path: '/signals' }
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const themeMode = useSelector( selectThemeMode )
  const activeSnapshotId = useSelector( ( state: RootState ) => state.pipeline.activeSnapshotId )

  const activeTab = NAV_TABS.find( ( tab ) => tab.path == location.pathname )?.path ?? false

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
          <Typography variant="subtitle1">Idea Sniffer</Typography>
          <Typography variant="caption" color="text.secondary">v0.1.0</Typography>
        </Box>

        <Tabs
          value={ activeTab }
          onChange={ ( _, value ) => navigate( value ) }
          textColor="primary"
          indicatorColor="primary"
          sx={ { ml: 4 } }
        >
          { NAV_TABS.map( ( tab ) => (
            <Tab key={ tab.path } label={ tab.label } value={ tab.path } />
          ) ) }
        </Tabs>

        <Box sx={ { display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' } }>
          { activeSnapshotId &&
            <Typography variant="caption" color="text.secondary">
              Snapshot: { activeSnapshotId }
            </Typography>
          }
          <IconButton onClick={ () => dispatch( toggleTheme() ) } color="inherit">
            { themeMode == 'dark' ? <LightMode /> : <DarkMode /> }
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
