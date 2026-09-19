// LIFF SDK type declarations (loaded via CDN in index.html)
declare const liff: {
  init: (config: { liffId: string }) => Promise<void>
  isLoggedIn: () => boolean
  isInClient: () => boolean
  login: (config?: { redirectUri?: string }) => void
  logout: () => void
  getAccessToken: () => string | null
  getProfile: () => Promise<{ userId: string; displayName: string; pictureUrl?: string }>
  getContext: () => { type: string } | null
}
