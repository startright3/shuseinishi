import { useState, useEffect, useCallback } from 'react'
import { getMemberByUserId, createMember, updateMember } from '../lib/firestore'
import type { MemberDoc, MemberInput } from '../types/member'

export function useMyProfile(userId: string) {
  const [profile, setProfile] = useState<MemberDoc | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const m = await getMemberByUserId(userId)
      setProfile(m)
    } catch {
      setError('プロフィールの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) load()
  }, [userId, load])

  async function saveProfile(data: MemberInput): Promise<void> {
    if (profile) {
      await updateMember(profile.id, data)
    } else {
      await createMember({ ...data, userId })
    }
    await load()
  }

  return { profile, isLoading, error, saveProfile, reload: load }
}
