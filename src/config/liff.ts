import { signInWithCustomToken } from 'firebase/auth'
import { auth } from './firebase'

export async function initLiff(): Promise<void> {
  const liffId = import.meta.env.VITE_LIFF_ID

  await liff.init({ liffId })

  if (!liff.isLoggedIn()) {
    liff.login()
    return
  }

  const lineAccessToken = liff.getAccessToken()
  if (!lineAccessToken) {
    throw new Error('LINE access token is null')
  }

  const functionsUrl = import.meta.env.VITE_FUNCTIONS_URL
  const res = await fetch(`${functionsUrl}/lineCustomToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lineAccessToken }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`lineCustomToken error: ${res.status} ${body}`)
  }

  const { customToken } = await res.json() as { customToken: string }
  await signInWithCustomToken(auth, customToken)
}
