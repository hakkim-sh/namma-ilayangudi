import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ListingsProvider } from './context/ListingsContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider><ListingsProvider><App /></ListingsProvider></LanguageProvider>
  </StrictMode>,
)
