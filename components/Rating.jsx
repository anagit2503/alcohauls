import { Star } from '@phosphor-icons/react'

export default function Rating({ value, count, className = '' }) {
  return (
    <p className={`flex items-center gap-1 text-[13px] text-muted ${className}`}>
      <Star size={13} weight="fill" className="text-brass" aria-hidden />
      <span className="text-ink font-medium price">{value.toFixed(1)}</span>
      <span className="price">({count})</span>
      <span className="sr-only">out of 5, from {count} reviews</span>
    </p>
  )
}
