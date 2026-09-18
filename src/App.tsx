import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminRoute } from './components/auth/AdminRoute'
import { Spinner } from './components/ui/Spinner'
import { LoginPage } from './pages/LoginPage'
import { PendingPage } from './pages/PendingPage'
import { MembersPage } from './pages/MembersPage'

const MemberDetailPage = lazy(() => import('./pages/MemberDetailPage').then(m => ({ default: m.MemberDetailPage })))
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })))

function SuspenseFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/members" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <MembersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<SuspenseFallback />}>
                  <MemberDetailPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Suspense fallback={<SuspenseFallback />}>
                  <AdminPage />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/members" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
