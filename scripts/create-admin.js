#!/usr/bin/env node
/**
 * 初回 admin ユーザー作成スクリプト
 *
 * Usage:
 *   node scripts/create-admin.js <LINE_UID> <表示名>
 *
 * 事前に以下のいずれかが必要:
 *   - GOOGLE_APPLICATION_CREDENTIALS 環境変数にサービスアカウントキーのパスを設定
 *   - firebase CLI でログイン済み（Application Default Credentials）
 */

const admin = require('firebase-admin')

const [, , lineUid, displayName] = process.argv

if (!lineUid || !displayName) {
  console.error('Usage: node scripts/create-admin.js <LINE_UID> <表示名>')
  console.error('Example: node scripts/create-admin.js Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 山田太郎')
  process.exit(1)
}

if (!lineUid.startsWith('U') || lineUid.length !== 33) {
  console.warn('Warning: LINE UID は通常 "U" から始まる33文字です。UID を確認してください。')
}

admin.initializeApp()
const db = admin.firestore()

async function createAdmin() {
  const ref = db.collection('users').doc(lineUid)
  const snap = await ref.get()

  if (snap.exists) {
    const data = snap.data()
    if (data.role === 'admin') {
      console.log(`ユーザー ${lineUid} は既に admin です。`)
      return
    }
    await ref.update({
      displayName,
      role: 'admin',
      status: 'approved',
    })
    console.log(`既存ユーザー ${lineUid} を admin に昇格しました。`)
  } else {
    await ref.set({
      uid: lineUid,
      displayName,
      role: 'admin',
      status: 'approved',
      branch: '札幌西',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    console.log(`Admin ユーザーを作成しました: ${displayName} (${lineUid})`)
  }
}

createAdmin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('エラー:', err.message)
    process.exit(1)
  })
