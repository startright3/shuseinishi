import * as admin from 'firebase-admin'
import { onRequest } from 'firebase-functions/v2/https'
import { defineString } from 'firebase-functions/params'
import axios from 'axios'

admin.initializeApp()

const db = admin.firestore()
const BRANCH = '札幌西'

const LINE_CHANNEL_ID = defineString('LINE_CHANNEL_ID')

interface LineProfile {
  userId: string
  displayName: string
  pictureUrl?: string
}

interface LineTokenVerify {
  client_id: string
  expires_in: number
  scope: string
}

const ALLOWED_ORIGINS = [
  'https://shuseinishi.web.app',
  'https://shuseinishi.firebaseapp.com',
  'http://localhost:5173',
]

export const lineCustomToken = onRequest(
  { region: 'asia-northeast1', cors: ALLOWED_ORIGINS },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }

    const { lineAccessToken } = req.body as { lineAccessToken?: string }
    if (!lineAccessToken) {
      res.status(400).json({ error: 'lineAccessToken is required' })
      return
    }

    // Verify LINE access token and get user profile
    let profile: LineProfile
    try {
      const response = await axios.get<LineProfile>('https://api.line.me/v2/profile', {
        headers: { Authorization: `Bearer ${lineAccessToken}` },
      })
      profile = response.data
    } catch {
      res.status(401).json({ error: 'Invalid LINE access token' })
      return
    }

    // Verify the token belongs to this app's LINE Login channel
    try {
      const verifyRes = await axios.get<LineTokenVerify>(
        `https://api.line.me/oauth2/v2.1/verify?access_token=${lineAccessToken}`,
      )
      if (verifyRes.data.client_id !== LINE_CHANNEL_ID.value()) {
        res.status(401).json({ error: 'Token channel mismatch' })
        return
      }
    } catch {
      res.status(401).json({ error: 'Token verification failed' })
      return
    }

    const { userId: lineUserId, displayName } = profile

    // Create Firestore user doc on first login; update displayName otherwise
    const userRef = db.collection('users').doc(lineUserId)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      await userRef.set({
        uid: lineUserId,
        displayName,
        role: 'member',
        status: 'pending',
        branch: BRANCH,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    } else {
      await userRef.update({ displayName })
    }

    const customToken = await admin.auth().createCustomToken(lineUserId)
    res.status(200).json({ customToken })
  },
)
