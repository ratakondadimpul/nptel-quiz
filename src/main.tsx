import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StatsProvider } from './contexts/StatsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StatsProvider>
      <App />
    </StatsProvider>
  </StrictMode>,
)
