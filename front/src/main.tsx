import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

import { TodoProvider } from './context/TodoContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import LoginPage from './pages/LoginPage.tsx'
import SharedListPage from './pages/SharedListPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import ProtectedAuthRoute from './components/ProtectedAuthRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TodoProvider>
          <Routes>
            <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
            <Route path="/shared/:token" element={<SharedListPage />} />
            <Route path="/login" element={<ProtectedAuthRoute><LoginPage /></ProtectedAuthRoute>} />
            <Route path="/register" element={<ProtectedAuthRoute><RegisterPage /></ProtectedAuthRoute>} />
          </Routes>
          <Toaster position="bottom-right" />
        </TodoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
