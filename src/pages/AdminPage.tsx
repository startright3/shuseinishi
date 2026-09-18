import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'
import { MemberForm } from '../components/member/MemberForm'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import type { MemberDoc, MemberInput } from '../types/member'

type Tab = 'pending' | 'members'

export function AdminPage() {
  const navigate = useNavigate()
  const { pendingUsers, members, isLoading, approveUser, rejectUser, addMember, editMember, removeMember } = useAdmin()
  const [tab, setTab] = useState<Tab>('pending')
  const [editingMember, setEditingMember] = useState<MemberDoc | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [actionError, setActionError] = useState('')

  async function handleApprove(uid: string) {
    setActionError('')
    try { await approveUser(uid) }
    catch { setActionError('承認に失敗しました') }
  }

  async function handleReject(uid: string) {
    if (!confirm('このユーザーを却下しますか？')) return
    setActionError('')
    try { await rejectUser(uid) }
    catch { setActionError('却下に失敗しました') }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return
    setActionError('')
    try { await removeMember(id) }
    catch { setActionError('削除に失敗しました') }
  }

  async function handleAddSubmit(data: MemberInput) {
    await addMember(data)
    setShowAddForm(false)
  }

  async function handleEditSubmit(data: MemberInput) {
    if (!editingMember) return
    await editMember(editingMember.id, data)
    setEditingMember(null)
  }

  if (showAddForm || editingMember) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => { setShowAddForm(false); setEditingMember(null) }}
              className="h-10 w-10 flex items-center justify-center text-gray-600 -ml-1"
            >
              ←
            </button>
            <h1 className="text-base font-bold text-gray-900">
              {editingMember ? '会員編集' : '会員追加'}
            </h1>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-6">
          <MemberForm
            initial={editingMember ?? undefined}
            onSubmit={editingMember ? handleEditSubmit : handleAddSubmit}
            onCancel={() => { setShowAddForm(false); setEditingMember(null) }}
          />
        </main>
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
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-900">管理画面</h1>
        </div>

        {/* Tabs */}
        <div className="max-w-lg mx-auto px-4 flex border-t border-gray-100">
          <button
            onClick={() => setTab('pending')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'pending'
                ? 'border-line-green text-line-green'
                : 'border-transparent text-gray-500'
            }`}
          >
            承認待ち
            {pendingUsers.length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingUsers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('members')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'members'
                ? 'border-line-green text-line-green'
                : 'border-transparent text-gray-500'
            }`}
          >
            会員管理
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 pb-10">
        {actionError && (
          <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{actionError}</div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Pending tab */}
        {!isLoading && tab === 'pending' && (
          <>
            {pendingUsers.length === 0 ? (
              <EmptyState title="承認待ちユーザーはいません" />
            ) : (
              <div className="space-y-3">
                {pendingUsers.map(user => (
                  <div key={user.uid} className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="font-semibold text-gray-900">{user.displayName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {user.branch && <span className="mr-2">🏢 {user.branch}</span>}
                      登録日: {user.createdAt?.toDate?.()?.toLocaleDateString('ja-JP') ?? '不明'}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => handleApprove(user.uid)} className="flex-1">
                        承認
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(user.uid)} className="flex-1">
                        却下
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Members tab */}
        {!isLoading && tab === 'members' && (
          <>
            <div className="mb-4">
              <Button onClick={() => setShowAddForm(true)} fullWidth>
                ＋ 会員を追加
              </Button>
            </div>
            {members.length === 0 ? (
              <EmptyState title="会員がいません" description="「会員を追加」から登録してください" />
            ) : (
              <div className="space-y-3">
                {members.map(m => (
                  <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{m.companyName}</p>
                        <p className="text-sm text-gray-500">{m.representative} · {m.industry}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => setEditingMember(m)} className="flex-1">
                        編集
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(m.id, m.companyName)} className="flex-1">
                        削除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
