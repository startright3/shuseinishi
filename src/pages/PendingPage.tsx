import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { useAuth } from '../hooks/useAuth'

export function PendingPage() {
  const { isApproved } = useAuthContext()
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isApproved) {
      navigate('/members', { replace: true })
    }
  }, [isApproved, navigate])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⏳</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">承認待ちです</h1>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          現在、管理者による承認をお待ちください。
          <br />
          承認されると自動的にメンバーページへ移動します。
        </p>
        <p className="mt-4 text-sm text-gray-400">
          承認に関するお問い合わせは、守成クラブ札幌西の世話人にご連絡ください。
        </p>
        <button
          onClick={() => logout()}
          className="mt-8 text-sm text-gray-400 underline"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}
