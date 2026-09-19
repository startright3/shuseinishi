import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { useAuth } from '../hooks/useAuth'
import { useMyProfile } from '../hooks/useMyProfile'
import { MemberForm } from '../components/member/MemberForm'
import { Spinner } from '../components/ui/Spinner'
import { Button } from '../components/ui/Button'
import type { MemberInput } from '../types/member'

export function ProfilePage() {
  const { firebaseUser, userDoc } = useAuthContext()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { profile, isLoading, saveProfile } = useMyProfile(firebaseUser?.uid ?? '')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function handleSubmit(data: MemberInput) {
    setIsSaving(true)
    setSaveError('')
    try {
      await saveProfile(data)
      setIsEditing(false)
    } catch {
      setSaveError('保存に失敗しました。もう一度お試しください。')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/members')}
            className="h-10 w-10 flex items-center justify-center text-gray-600 -ml-1"
            aria-label="戻る"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">マイプロフィール</h1>
          <button
            onClick={() => logout()}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            ログアウト
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 pb-10">
        {/* User info card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-line-green rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">
              {userDoc?.displayName?.charAt(0) ?? '?'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{userDoc?.displayName}</p>
            <p className="text-sm text-gray-400">守成クラブ {userDoc?.branch}</p>
          </div>
        </div>

        {/* No profile yet */}
        {!profile && !isEditing && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-semibold text-gray-900 mb-1">ビジネスプロフィールを登録しましょう</p>
            <p className="text-sm text-gray-500 mb-4">
              会社情報を登録すると、他の会員があなたを見つけやすくなります。
            </p>
            <Button onClick={() => setIsEditing(true)} fullWidth>
              プロフィールを登録する
            </Button>
          </div>
        )}

        {/* Edit form */}
        {isEditing && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">
              {profile ? 'プロフィールを編集' : 'プロフィールを登録'}
            </h2>
            <MemberForm
              initial={profile ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
            />
            {isSaving && (
              <div className="mt-3 flex justify-center">
                <Spinner size="sm" />
              </div>
            )}
            {saveError && (
              <p className="mt-2 text-sm text-center text-red-500">{saveError}</p>
            )}
          </div>
        )}

        {/* Profile display */}
        {profile && !isEditing && (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.companyName}</h2>
                  <p className="text-base text-gray-500 mt-0.5">{profile.representative}</p>
                </div>
                <span className="shrink-0 bg-green-50 text-line-green text-sm font-medium px-3 py-1 rounded-full">
                  {profile.industry}
                </span>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(true)} fullWidth>
                編集する
              </Button>
            </div>

            {[
              { label: '強み・特徴', value: profile.strength },
              { label: '対応できる仕事', value: profile.services },
              { label: '紹介してほしい仕事', value: profile.referralWanted },
              { label: '紹介できる仕事', value: profile.referralOffered },
            ].filter(s => s.value).map(s => (
              <div key={s.label} className="bg-white rounded-2xl px-5 py-4 shadow-sm mb-3">
                <p className="text-xs font-medium text-gray-400 mb-1">{s.label}</p>
                <p className="text-base text-gray-800 whitespace-pre-wrap">{s.value}</p>
              </div>
            ))}

            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
              <p className="text-xs font-medium text-gray-400 mb-1">電話番号</p>
              <p className="text-base text-gray-800">{profile.phone || '未登録'}</p>
              <p className="text-xs font-medium text-gray-400 mt-3 mb-1">LINE連絡</p>
              <p className="text-base text-gray-800">{profile.lineAvailable ? '受け付けています' : '受け付けていません'}</p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
