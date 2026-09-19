export const BRANCH = '札幌西'

export const INDUSTRIES = [
  '建設・土木',
  '不動産',
  '製造・メーカー',
  'IT・システム',
  '飲食・食品',
  '小売・流通',
  '医療・福祉',
  '教育・研修',
  '金融・保険',
  '士業・コンサルタント',
  '広告・マーケティング',
  '運輸・物流',
  '美容・健康',
  'イベント・エンターテイメント',
  'その他',
] as const

export type Industry = (typeof INDUSTRIES)[number]

export const buildSearchTokens = (data: {
  companyName: string
  industry: string
  strength: string
  services: string
}): string[] => {
  const text = [data.companyName, data.industry, data.strength, data.services]
    .join(' ')
    .toLowerCase()
  return Array.from(new Set(text.split(/[\s　、。,]+/).filter(t => t.length > 0)))
}
