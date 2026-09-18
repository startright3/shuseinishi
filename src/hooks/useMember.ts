import { useState, useEffect } from 'react'
import { getMemberById } from '../lib/firestore'
import type { MemberDoc } from '../types/member'

export function useMember(id: string) {
  const [member, setMember] = useState<MemberDoc | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    getMemberById(id)
      .then(m => {
        if (!m) setError('会員が見つかりません')
        else setMember(m)
      })
      .catch(() => setError('読み込みに失敗しました'))
      .finally(() => setIsLoading(false))
  }, [id])

  return { member, isLoading, error }
}
