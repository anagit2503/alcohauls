import Head from 'next/head'
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '@/lib/products'

const FAQS = [
  {
    id: 'delivery', q: 'How does delivery work?',
    a: `Order by 4pm and we deliver the same evening. Delivery is free on orders over $${FREE_DELIVERY_THRESHOLD}, otherwise it’s $${DELIVERY_FEE}. You choose a two-hour window at checkout.`,
  },
  {
    id: 'age', q: 'Why do you check ID?',
    a: 'It’s the law. Everyone who orders must be 21 or over, and the person receiving the order must show valid photo ID. If nobody 21+ is home, we’ll take the order back and rebook it.',
  },
  {
    id: 'returns', q: 'Can I return a bottle?',
    a: 'Unopened bottles can be returned within 30 days for a full refund. If a bottle arrives damaged or a wine is corked, tell us within 7 days and we’ll replace it.',
  },
  {
    q: 'Do you deliver chilled?',
    a: 'White wine, rosé, sparkling wine and beer travel in insulated bags so they arrive ready to drink.',
  },
  {
    q: 'Can I change my delivery window?',
    a: 'Yes, up to two hours before your window starts. Reply to your confirmation email with the time that suits you.',
  },
]

export default function Help() {
  return (
    <>
      <Head><title>Help | Alcohauls</title></Head>
      <div className="wrap max-w-3xl pt-10">
        <h1 className="font-display text-[40px] sm:text-[48px]">Help</h1>
        <p className="mt-2 text-muted">Answers to the questions we’re asked most.</p>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {FAQS.map((f) => (
            <details key={f.q} id={f.id} className="group py-5" open={Boolean(f.id)}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium">
                {f.q}
                <span className="text-[22px] font-light text-muted transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 max-w-prose leading-relaxed text-ink/80">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  )
}
