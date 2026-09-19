import { Link } from 'react-router-dom'
import type { MemberDoc } from '../../types/member'

interface MemberCardProps {
  member: MemberDoc
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link
      to={`/members/${member.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-gray-900 truncate">{member.companyName}</p>
          <p className="mt-0.5 text-sm text-gray-500 truncate">{member.representative}</p>
        </div>
        <span className="shrink-0 inline-block bg-green-50 text-line-green text-xs font-medium px-2.5 py-1 rounded-full">
          {member.industry}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-700 line-clamp-2">{member.strength}</p>
      <div className="mt-3 flex items-center text-xs text-gray-400">
        <span>詳細を見る →</span>
      </div>
    </Link>
  )
}
