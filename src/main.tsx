// React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Redux
import { Provider } from 'react-redux'
// Mui
import { CssBaseline } from '@mui/material'
// App
import App from './App.tsx'
import './index.css'
import { store } from '@store/store.ts'

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <Provider store={ store }>
      <CssBaseline />
      <App />
    </Provider>
  </StrictMode>,
)
