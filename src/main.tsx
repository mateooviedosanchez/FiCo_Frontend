import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import FiCoApp from './FiCoApp'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <FiCoApp />
    </StrictMode>
  </BrowserRouter>,
)
