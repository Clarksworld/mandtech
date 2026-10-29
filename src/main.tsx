import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { InquiryProvider } from './context/InquiryContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <InquiryProvider>
        <App />
      </InquiryProvider>
    </AuthProvider>
  </StrictMode>,
)
