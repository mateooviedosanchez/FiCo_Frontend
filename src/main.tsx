import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FiCoApp from './FiCoApp'

createRoot(document.getElementById('root')!).render(

    <StrictMode>
      <FiCoApp/>
    </StrictMode>
)
