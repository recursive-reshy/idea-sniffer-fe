// React
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
// MUI
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
// Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Components
import { LoadingLinear, Navbar } from '@components/index'
// Store
import { selectIsApiLoading, selectThemeMode } from '@store/index'
// Theme
import { darkTheme, lightTheme } from '@theme/theme'
// Pages
import PageSignals from '@pages/signals/PageSignals'
import PagePipeline from '@pages/pipeline/PagePipeline'

function App() {
  const isLoading = useSelector( selectIsApiLoading )
  const themeMode = useSelector( selectThemeMode )
  const theme = themeMode == 'dark' ? darkTheme : lightTheme

  useEffect( () => {
    localStorage.setItem( 'themeMode', themeMode )
  }, [ themeMode ] )

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={ { display: 'flex', flexDirection: 'column', minHeight: '100vh' } }>
          <LoadingLinear isLoading={ isLoading } />
          <Navbar />
          <Box component="main" sx={ { flex: 1, overflow: 'auto' } }>
            <Routes>
              <Route path="/" element={ <Navigate to="/signals" replace /> } />
              <Route path="/pipeline" element={ <PagePipeline /> } />
              <Route path="/signals" element={ <PageSignals /> } />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
