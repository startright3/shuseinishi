import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../config/firebase'
import { subscribeUser } from '../lib/firestore'
import type { UserDoc } from '../types/user'

interface AuthContextValue {
  firebaseUser: User | null
  userDoc: UserDoc | null
  loading: boolean
  isApproved: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  userDoc: null,
  loading: true,
  isApproved: false,
  isAdmin: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [docLoading, setDocLoading] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      if (user) setDocLoading(true)
      setFirebaseUser(user)
      setAuthLoading(false)
      if (!user) {
        setUserDoc(null)
        setDocLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    if (!firebaseUser) return
    setDocLoading(true)
    const unsub = subscribeUser(firebaseUser.uid, doc => {
      setUserDoc(doc)
      setDocLoading(false)
    })
    return unsub
  }, [firebaseUser])

  const loading = authLoading || (firebaseUser !== null && docLoading)
  const isApproved = userDoc?.status === 'approved'
  const isAdmin = userDoc?.role === 'admin'

  return (
    <AuthContext.Provider value={{ firebaseUser, userDoc, loading, isApproved, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
