import { useParams, useNavigate } from 'react-router-dom'
import { useMember } from '../hooks/useMember'
import { Spinner } from '../components/ui/Spinner'

function Section({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  )
}

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { member, isLoading, error } = useMember(id ?? '')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <p className="text-gray-500">{error ?? '会員が見つかりません'}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-line-green text-sm underline">
          戻る
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 flex items-center justify-center text-gray-600 -ml-1"
            aria-label="戻る"
          >
            ←
          </button>
          <h1 className="text-base font-bold text-gray-900 truncate">{member.companyName}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 pb-32">
        {/* Company header card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{member.companyName}</h2>
              <p className="text-base text-gray-600 mt-0.5">{member.representative}</p>
            </div>
            <span className="shrink-0 inline-block bg-green-50 text-line-green text-sm font-medium px-3 py-1 rounded-full">
              {member.industry}
            </span>
          </div>
        </div>

        {/* Detail sections */}
        <div className="bg-white rounded-2xl px-5 shadow-sm mb-4">
          <Section label="強み・特徴" value={member.strength} />
          <Section label="対応できる仕事" value={member.services} />
          <Section label="紹介してほしい仕事" value={member.referralWanted} />
          <Section label="紹介できる仕事" value={member.referralOffered} />
        </div>

        {/* Contact info */}
        {(member.phone || member.lineAvailable) && (
          <div className="bg-white rounded-2xl px-5 shadow-sm mb-6">
            {member.phone && (
              <div className="py-4 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">電話番号</p>
                <p className="text-base text-gray-800">{member.phone}</p>
              </div>
            )}
            {member.lineAvailable && (
              <div className="py-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">LINE</p>
                <p className="text-base text-gray-800">✓ LINE連絡可</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Action buttons - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 safe-area-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          {member.phone && (
            <a
              href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
              className="flex-1 h-14 bg-line-green text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 active:bg-line-green-dark"
            >
              📞 電話する
            </a>
          )}
          {member.lineAvailable && (
            <a
              href={`https://line.me/R/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-14 bg-[#00B900] text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 active:opacity-80"
            >
              💬 LINE
            </a>
          )}
          {!member.phone && !member.lineAvailable && (
            <p className="flex-1 text-center text-sm text-gray-400 py-4">連絡先未登録</p>
          )}
        </div>
      </div>
    </div>
  )
}
