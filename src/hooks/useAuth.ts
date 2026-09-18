import { useAuthContext } from '../contexts/AuthContext'
import { initLiff } from '../config/liff'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

export function useAuth() {
  const ctx = useAuthContext()

  async function signIn() {
    await initLiff()
  }

  async function logout() {
    if (typeof liff !== 'undefined' && liff.isLoggedIn()) {
      liff.logout()
    }
    await signOut(auth)
  }

  return { ...ctx, signIn, logout }
}
