import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { UserListsProvider } from './context/UserListsContext.tsx'
import { MuiThemeProvider } from './MuiThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MuiThemeProvider>
      <BrowserRouter>
        <UserListsProvider>
          <App />
        </UserListsProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  </StrictMode>,
)
