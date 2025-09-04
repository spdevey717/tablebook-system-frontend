// Import Main Libraries
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import Other Libraries
import { GoogleOAuthProvider } from "@react-oauth/google";

// Import Custom Libraries
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID /* or plain string in dev */}>
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>
)
