import { useState, useEffect, useCallback } from 'react'
import {
  getPendingUsers,
  updateUserStatus,
  getAllMembersForAdmin,
  createMember,
  updateMember,
  deleteMember,
} from '../lib/firestore'
import type { UserDoc } from '../types/user'
import type { MemberDoc, MemberInput } from '../types/member'

export function useAdmin() {
  const [pendingUsers, setPendingUsers] = useState<UserDoc[]>([])
  const [members, setMembers] = useState<MemberDoc[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  const loadPending = useCallback(async () => {
    const users = await getPendingUsers()
    setPendingUsers(users)
  }, [])

  const loadMembers = useCallback(async () => {
    const all = await getAllMembersForAdmin()
    setMembers(all)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setLoadError('')
    Promise.all([loadPending(), loadMembers()])
      .catch(() => setLoadError('データの読み込みに失敗しました。画面を再読み込みしてください。'))
      .finally(() => setIsLoading(false))
  }, [loadPending, loadMembers])

  async function approveUser(uid: string) {
    await updateUserStatus(uid, 'approved')
    await loadPending()
  }

  async function rejectUser(uid: string) {
    await updateUserStatus(uid, 'rejected')
    await loadPending()
  }

  async function addMember(data: MemberInput) {
    await createMember(data)
    await loadMembers()
  }

  async function editMember(id: string, data: Partial<MemberInput>) {
    await updateMember(id, data)
    await loadMembers()
  }

  async function removeMember(id: string) {
    await deleteMember(id)
    await loadMembers()
  }

  return {
    pendingUsers,
    members,
    isLoading,
    loadError,
    approveUser,
    rejectUser,
    addMember,
    editMember,
    removeMember,
    refresh: () => { loadPending(); loadMembers() },
  }
}
