import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { UserListsProvider } from './context/UserListsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserListsProvider>
        <App />
      </UserListsProvider>
    </BrowserRouter>
  </StrictMode>,
)
