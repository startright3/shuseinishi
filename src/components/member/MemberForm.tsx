import { useState } from 'react'
import type { MemberDoc, MemberInput } from '../../types/member'
import { INDUSTRIES, BRANCH } from '../../utils/constants'
import { Button } from '../ui/Button'

interface MemberFormProps {
  initial?: MemberDoc
  onSubmit: (data: MemberInput) => Promise<void>
  onCancel: () => void
}

const EMPTY: MemberInput = {
  branch: BRANCH,
  companyName: '',
  representative: '',
  industry: '',
  strength: '',
  services: '',
  referralWanted: '',
  referralOffered: '',
  phone: '',
  lineAvailable: false,
}

export function MemberForm({ initial, onSubmit, onCancel }: MemberFormProps) {
  const [form, setForm] = useState<MemberInput>(
    initial
      ? {
          branch: initial.branch,
          companyName: initial.companyName,
          representative: initial.representative,
          industry: initial.industry,
          strength: initial.strength,
          services: initial.services,
          referralWanted: initial.referralWanted,
          referralOffered: initial.referralOffered,
          phone: initial.phone,
          lineAvailable: initial.lineAvailable,
        }
      : EMPTY,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof MemberInput, val: string | boolean) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.companyName.trim() || !form.industry) {
      setError('会社名と業種は必須です')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      await onSubmit(form)
    } catch {
      setError('保存に失敗しました。もう一度お試しください。')
      setIsSubmitting(false)
    }
  }

  const field = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-line-green'
  const label = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={label}>会社名 <span className="text-red-500">*</span></label>
        <input className={field} value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="株式会社○○" required />
      </div>
      <div>
        <label className={label}>代表者名</label>
        <input className={field} value={form.representative} onChange={e => set('representative', e.target.value)} placeholder="山田 太郎" />
      </div>
      <div>
        <label className={label}>業種 <span className="text-red-500">*</span></label>
        <select className={field} value={form.industry} onChange={e => set('industry', e.target.value)} required>
          <option value="">選択してください</option>
          {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
        </select>
      </div>
      <div>
        <label className={label}>強み・特徴</label>
        <textarea className={`${field} resize-none`} rows={3} value={form.strength} onChange={e => set('strength', e.target.value)} placeholder="得意なこと、強みを入力" />
      </div>
      <div>
        <label className={label}>対応できる仕事</label>
        <textarea className={`${field} resize-none`} rows={2} value={form.services} onChange={e => set('services', e.target.value)} placeholder="受注できるサービスや業務" />
      </div>
      <div>
        <label className={label}>紹介してほしい仕事</label>
        <textarea className={`${field} resize-none`} rows={2} value={form.referralWanted} onChange={e => set('referralWanted', e.target.value)} placeholder="どんな案件・お客様を求めているか" />
      </div>
      <div>
        <label className={label}>紹介できる仕事</label>
        <textarea className={`${field} resize-none`} rows={2} value={form.referralOffered} onChange={e => set('referralOffered', e.target.value)} placeholder="紹介可能な案件・お客様" />
      </div>
      <div>
        <label className={label}>電話番号</label>
        <input type="tel" className={field} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="011-000-0000" />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="lineAvailable"
          className="h-5 w-5 rounded text-line-green focus:ring-line-green"
          checked={form.lineAvailable}
          onChange={e => set('lineAvailable', e.target.checked)}
        />
        <label htmlFor="lineAvailable" className="text-base text-gray-700">LINE連絡可</label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? '保存中…' : '保存する'}
        </Button>
      </div>
    </form>
  )
}
