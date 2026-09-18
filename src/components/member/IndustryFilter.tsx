import { INDUSTRIES } from '../../utils/constants'

interface IndustryFilterProps {
  value: string
  onChange: (val: string) => void
}

export function IndustryFilter({ value, onChange }: IndustryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
      <button
        onClick={() => onChange('')}
        className={`shrink-0 h-9 px-4 rounded-full text-sm font-medium transition-colors ${
          value === ''
            ? 'bg-line-green text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        すべて
      </button>
      {INDUSTRIES.map(ind => (
        <button
          key={ind}
          onClick={() => onChange(value === ind ? '' : ind)}
          className={`shrink-0 h-9 px-4 rounded-full text-sm font-medium transition-colors ${
            value === ind
              ? 'bg-line-green text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {ind}
        </button>
      ))}
    </div>
  )
}
