import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { Spinner } from '../ui/Spinner'
import type { ReactNode } from 'react'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, isApproved, isAdmin, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!firebaseUser) return <Navigate to="/login" replace />
  if (!isApproved) return <Navigate to="/pending" replace />
  if (!isAdmin) return <Navigate to="/members" replace />

  return <>{children}</>
}
