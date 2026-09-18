import { useState, useEffect, useCallback } from 'react'
import {
  getPendingUsers,
  updateUserStatus,
  getMembers,
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

  const loadPending = useCallback(async () => {
    setIsLoading(true)
    try {
      const users = await getPendingUsers()
      setPendingUsers(users)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadMembers = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getMembers()
      setMembers(result.members)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPending()
    loadMembers()
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
    approveUser,
    rejectUser,
    addMember,
    editMember,
    removeMember,
    refresh: () => { loadPending(); loadMembers() },
  }
}
