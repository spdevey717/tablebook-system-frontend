// Import Main Libraries
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import Custom Libraries
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
