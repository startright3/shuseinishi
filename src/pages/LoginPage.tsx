import { useState } from 'react'
import { Spinner } from '../components/ui/Spinner'
import { initLiff } from '../config/liff'

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setIsLoading(true)
    setError('')
    try {
      await initLiff()
    } catch (err) {
      console.error(err)
      setError('ログインに失敗しました。もう一度お試しください。')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-line-green rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-4xl font-bold">守</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">守成コネクト</h1>
          <p className="mt-1 text-base text-gray-500">札幌西</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-center text-gray-600">
            守成クラブ札幌西の会員専用アプリです。
            <br />
            LINEでログインしてください。
          </p>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-14 bg-line-green text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 hover:bg-line-green-dark active:bg-line-green-dark transition-colors disabled:opacity-60"
          >
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.01 2 11c0 2.87 1.38 5.43 3.56 7.17L5 21l2.99-1.56C9.22 19.79 10.58 20 12 20c5.52 0 10-4.01 10-9S17.52 2 12 2zm1.5 12.5h-3v-1.5h3v1.5zm0-3h-3V7h3v4.5z"/>
                </svg>
                LINEでログイン
              </>
            )}
          </button>

          {error && (
            <p className="text-sm text-center text-red-500">{error}</p>
          )}
        </div>

        <p className="mt-12 text-xs text-center text-gray-400">
          守成クラブ札幌西 会員の方のみご利用いただけます
        </p>
      </div>
    </div>
  )
}
