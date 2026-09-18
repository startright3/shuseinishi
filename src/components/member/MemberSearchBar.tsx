import { useState } from 'react'

interface MemberSearchBarProps {
  value: string
  onChange: (val: string) => void
}

export function MemberSearchBar({ value, onChange }: MemberSearchBarProps) {
  const [inputVal, setInputVal] = useState(value)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onChange(inputVal.trim())
  }

  function handleClear() {
    setInputVal('')
    onChange('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="search"
          inputMode="search"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="会社名・業種・強みで検索"
          className="w-full h-12 pl-10 pr-10 border border-gray-200 rounded-xl text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-line-green focus:bg-white"
        />
        {inputVal && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1"
            aria-label="クリア"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="h-12 px-4 bg-line-green text-white font-semibold rounded-xl text-sm shrink-0"
      >
        検索
      </button>
    </form>
  )
}
