import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { Spinner } from '../ui/Spinner'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, isApproved, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!firebaseUser) return <Navigate to="/login" replace />
  if (!isApproved) return <Navigate to="/pending" replace />

  return <>{children}</>
}
