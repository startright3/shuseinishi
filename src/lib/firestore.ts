import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { UserDoc, Status } from '../types/user'
import type { MemberDoc, MemberInput } from '../types/member'
import { buildSearchTokens } from '../utils/constants'

// Users

export function subscribeUser(uid: string, cb: (user: UserDoc | null) => void): Unsubscribe {
  const ref = doc(db, 'users', uid)
  return onSnapshot(ref, snap => {
    cb(snap.exists() ? ({ uid: snap.id, ...snap.data() } as UserDoc) : null)
  })
}

export async function updateUserStatus(uid: string, status: Status): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { status })
}

export async function getPendingUsers(): Promise<UserDoc[]> {
  const q = query(
    collection(db, 'users'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserDoc))
}

export async function getAllUsers(): Promise<UserDoc[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserDoc))
}

// Members

const PAGE_SIZE = 50

export interface MemberQuery {
  industry?: string
  keyword?: string
  after?: QueryDocumentSnapshot
}

export interface MembersPage {
  members: MemberDoc[]
  lastDoc: QueryDocumentSnapshot | null
  hasMore: boolean
}

export async function getMembers({ industry, keyword, after: afterDoc }: MemberQuery = {}): Promise<MembersPage> {
  const constraints = []

  if (industry) {
    constraints.push(where('industry', '==', industry))
  }
  if (keyword) {
    constraints.push(where('searchTokens', 'array-contains', keyword.toLowerCase()))
  }

  constraints.push(orderBy('createdAt', 'desc'))
  constraints.push(limit(PAGE_SIZE + 1))

  if (afterDoc) {
    constraints.push(startAfter(afterDoc))
  }

  const q = query(collection(db, 'members'), ...constraints)
  const snap = await getDocs(q)
  const docs = snap.docs

  const hasMore = docs.length > PAGE_SIZE
  const pageDocs = hasMore ? docs.slice(0, PAGE_SIZE) : docs

  return {
    members: pageDocs.map(d => ({ id: d.id, ...d.data() } as MemberDoc)),
    lastDoc: pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null,
    hasMore,
  }
}

export async function getMemberById(id: string): Promise<MemberDoc | null> {
  const snap = await getDoc(doc(db, 'members', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as MemberDoc) : null
}

export async function createMember(data: MemberInput): Promise<string> {
  const ref = doc(collection(db, 'members'))
  const searchTokens = buildSearchTokens(data)
  await setDoc(ref, {
    ...data,
    searchTokens,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateMember(id: string, data: Partial<MemberInput>): Promise<void> {
  const updates: Record<string, unknown> = { ...data }
  if (data.companyName || data.industry || data.strength || data.services) {
    const current = await getMemberById(id)
    if (current) {
      updates.searchTokens = buildSearchTokens({
        companyName: data.companyName ?? current.companyName,
        industry: data.industry ?? current.industry,
        strength: data.strength ?? current.strength,
        services: data.services ?? current.services,
      })
    }
  }
  await updateDoc(doc(db, 'members', id), updates)
}

export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(doc(db, 'members', id))
}
