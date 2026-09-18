import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMembers } from '../hooks/useMembers'
import { useAuthContext } from '../contexts/AuthContext'
import { MemberCard } from '../components/member/MemberCard'
import { MemberSearchBar } from '../components/member/MemberSearchBar'
import { IndustryFilter } from '../components/member/IndustryFilter'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'

export function MembersPage() {
  const { isAdmin } = useAuthContext()
  const { members, isLoading, hasMore, search, setSearch, industry, setIndustry, loadMore, refresh } = useMembers()

  useEffect(() => {
    refresh()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">守成コネクト <span className="text-sm font-normal text-gray-500">札幌西</span></h1>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="h-9 px-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex items-center"
              >
                管理
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {/* Search */}
        <div className="space-y-3 mb-4">
          <MemberSearchBar value={search} onChange={setSearch} />
          <IndustryFilter value={industry} onChange={setIndustry} />
        </div>

        {/* Results count */}
        {!isLoading && members.length > 0 && (
          <p className="text-sm text-gray-500 mb-3">
            {members.length}件{hasMore ? '表示中（さらにあります）' : ''}
          </p>
        )}

        {/* Member list */}
        {isLoading && members.length === 0 ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : members.length === 0 ? (
          <EmptyState
            title="会員が見つかりません"
            description="検索条件を変えてお試しください"
          />
        ) : (
          <div className="space-y-3">
            {members.map(m => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="h-12 px-8 bg-white border border-gray-200 rounded-xl text-base text-gray-600 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Spinner size="sm" /> : 'もっと見る'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
