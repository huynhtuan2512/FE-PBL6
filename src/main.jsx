import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import DesignSystemProvider from './design-system/DesignSystemProvider'
import 'antd/dist/reset.css'
import './design-system/design-system.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DesignSystemProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </DesignSystemProvider>
  </React.StrictMode>,
)
