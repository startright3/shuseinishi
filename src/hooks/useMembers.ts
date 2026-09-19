import { useState, useCallback } from 'react'
import { getMembers, type MembersPage } from '../lib/firestore'
import type { MemberDoc } from '../types/member'
import type { QueryDocumentSnapshot } from 'firebase/firestore'

export function useMembers() {
  const [members, setMembers] = useState<MemberDoc[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null)
  const [search, setSearchState] = useState('')
  const [industry, setIndustryState] = useState('')

  const load = useCallback(async (opts: { search: string; industry: string; reset: boolean; after?: QueryDocumentSnapshot | null }) => {
    setIsLoading(true)
    try {
      const result: MembersPage = await getMembers({
        industry: opts.industry || undefined,
        keyword: opts.search.trim() || undefined,
        after: opts.after ?? undefined,
      })
      setMembers(prev => opts.reset ? result.members : [...prev, ...result.members])
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setSearch = useCallback((val: string) => {
    setSearchState(val)
    setLastDoc(null)
    load({ search: val, industry, reset: true })
  }, [industry, load])

  const setIndustry = useCallback((val: string) => {
    setIndustryState(val)
    setLastDoc(null)
    load({ search, industry: val, reset: true })
  }, [search, load])

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return
    load({ search, industry, reset: false, after: lastDoc })
  }, [hasMore, isLoading, search, industry, lastDoc, load])

  const refresh = useCallback(() => {
    setLastDoc(null)
    load({ search, industry, reset: true })
  }, [search, industry, load])

  return { members, isLoading, hasMore, search, setSearch, industry, setIndustry, loadMore, refresh }
}
