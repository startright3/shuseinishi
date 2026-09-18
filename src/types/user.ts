import type { Timestamp } from 'firebase/firestore'

export type Role = 'member' | 'admin'
export type Status = 'pending' | 'approved' | 'rejected'

export interface UserDoc {
  uid: string
  displayName: string
  role: Role
  status: Status
  branch: string
  createdAt: Timestamp
}
