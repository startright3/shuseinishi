import type { Timestamp } from 'firebase/firestore'

export interface MemberDoc {
  id: string
  branch: string
  companyName: string
  representative: string
  industry: string
  strength: string
  services: string
  referralWanted: string
  referralOffered: string
  phone: string
  lineAvailable: boolean
  searchTokens: string[]
  createdAt: Timestamp
}

export type MemberInput = Omit<MemberDoc, 'id' | 'createdAt' | 'searchTokens'>
