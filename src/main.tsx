// React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Redux
import { Provider } from 'react-redux'
// App
import App from './App.tsx'
import './index.css'
import { store } from '@store/store.ts'

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <Provider store={ store }>
      <App />
    </Provider>
  </StrictMode>,
)
