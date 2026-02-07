import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PvpProvider } from './context/PvPContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PvpProvider>
          <App />
        </PvpProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)