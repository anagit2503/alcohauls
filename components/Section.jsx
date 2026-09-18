import Link from 'next/link'

export default function SectionHead({ title, intro, href, linkText }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-6">
      <div>
        <h2 className="font-display text-[30px] leading-tight sm:text-[36px]">{title}</h2>
        {intro && <p className="mt-1.5 max-w-xl text-muted">{intro}</p>}
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-[14px] font-medium underline underline-offset-4 decoration-line hover:decoration-ink">
          {linkText}
        </Link>
      )}
    </div>
  )
}
