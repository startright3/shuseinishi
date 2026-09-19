export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  }[size]

  return (
    <div
      className={`${cls} animate-spin rounded-full border-gray-300 border-t-line-green`}
      role="status"
      aria-label="読み込み中"
    />
  )
}
