import { useId } from 'react'

// Silhouettes are drawn in a 120 × 300 box, centred on x = 60, standing on y = 292.
// body: horizontal extent of the straight part (for the label); fill: where liquid starts;
// label: vertical position of the label; cap: closure rectangle.
const SHAPES = {
  bordeaux: {
    path: 'M52 22 H68 V86 C68 100 90 104 90 124 V284 Q90 292 82 292 H38 Q30 292 30 284 V124 C30 104 52 100 52 86 Z',
    body: [30, 90], fill: 104, label: [170, 78], cap: { x: 51, y: 14, w: 18, h: 44 },
  },
  burgundy: {
    path: 'M52 22 H68 V72 C68 110 92 120 92 152 V284 Q92 292 84 292 H36 Q28 292 28 284 V152 C28 120 52 110 52 72 Z',
    body: [28, 92], fill: 110, label: [176, 76], cap: { x: 51, y: 14, w: 18, h: 44 },
  },
  champagne: {
    path: 'M51 26 H69 V70 C69 116 95 122 95 156 V284 Q95 292 87 292 H33 Q25 292 25 284 V156 C25 122 51 116 51 70 Z',
    body: [25, 95], fill: 112, label: [178, 64], cap: { x: 48, y: 12, w: 24, h: 78, foil: true },
  },
  whisky: {
    path: 'M49 44 H71 V98 Q71 108 80 110 L90 112 Q97 114 97 124 V286 Q97 292 91 292 H29 Q23 292 23 286 V124 Q23 114 30 112 L40 110 Q49 108 49 98 Z',
    body: [23, 97], fill: 128, label: [160, 92], cap: { x: 45, y: 22, w: 30, h: 26, wood: true },
  },
  gin: {
    path: 'M51 96 H69 V120 Q69 130 82 133 L95 137 Q101 139 101 149 V286 Q101 292 95 292 H25 Q19 292 19 286 V149 Q19 139 25 137 L38 133 Q51 130 51 120 Z',
    body: [19, 101], fill: 144, label: [176, 80], cap: { x: 46, y: 70, w: 28, h: 30, wood: true },
  },
  vodka: {
    path: 'M53 22 H67 V80 C67 96 82 100 82 118 V286 Q82 292 76 292 H44 Q38 292 38 286 V118 C38 100 53 96 53 80 Z',
    body: [38, 82], fill: 110, label: [168, 84], cap: { x: 52, y: 12, w: 16, h: 30 },
  },
  tequila: {
    path: 'M50 96 H70 V110 Q70 120 84 122 Q98 124 98 140 V284 Q98 292 90 292 H30 Q22 292 22 284 V140 Q22 124 36 122 Q50 120 50 110 Z',
    body: [22, 98], fill: 132, label: [178, 74], cap: { x: 42, y: 52, w: 36, h: 48, wood: true, round: true },
  },
  rum: {
    path: 'M52 44 H68 V100 C68 120 96 132 96 186 V282 Q96 292 86 292 H34 Q24 292 24 282 V186 C24 132 52 120 52 100 Z',
    body: [24, 96], fill: 140, label: [192, 70], cap: { x: 48, y: 24, w: 24, h: 24 },
  },
  beer: {
    path: 'M54 70 H66 V112 C66 132 84 138 84 164 V286 Q84 292 78 292 H42 Q36 292 36 286 V164 C36 138 54 132 54 112 Z',
    body: [36, 84], fill: 116, label: [196, 62], cap: { x: 52, y: 62, w: 16, h: 10 },
  },
}

function initials(name) {
  return name.split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('')
}

export default function Bottle({ product, className = '', title = true }) {
  const uid = useId().replace(/:/g, '')
  const { bottle, maker, name } = product
  const s = SHAPES[bottle.shape] || SHAPES.bordeaux
  const [left, right] = s.body
  const inset = Math.max(4, (right - left) * 0.08)
  const lx = left + inset
  const lw = right - left - inset * 2
  const [ly, lh] = s.label
  const cx = 60
  const shortMaker = maker.replace(/^(Château|Domaine|Maison|Bodega|Casa)\s/, '')
  const makerSize = Math.min(9, (lw * 1.55) / Math.max(shortMaker.length, 6))
  const clip = `clip-${uid}`
  const shade = `shade-${uid}`

  return (
    <svg
      viewBox="0 0 120 300"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title ? `${name} bottle` : undefined}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <clipPath id={clip}>
          <path d={s.path} />
        </clipPath>
        <linearGradient id={shade} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.78" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      <ellipse cx={cx} cy="293" rx={(right - left) / 2 + 6} ry="3.5" fill="#000" opacity="0.10" />

      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="120" height="300" fill={bottle.glass} />
        {bottle.liquid && <rect x="0" y={s.fill} width="120" height={300 - s.fill} fill={bottle.liquid} opacity="0.9" />}
        <rect x="0" y="0" width="120" height="300" fill={`url(#${shade})`} />
      </g>

      {/* closure */}
      <rect
        x={s.cap.x} y={s.cap.y} width={s.cap.w} height={s.cap.h}
        rx={s.cap.round ? s.cap.w / 2.4 : 2}
        fill={bottle.cap}
      />
      {s.cap.foil && <rect x={s.cap.x} y={s.cap.y + s.cap.h - 8} width={s.cap.w} height="3" fill="#000" opacity="0.18" />}
      {s.cap.wood && <rect x={s.cap.x} y={s.cap.y + s.cap.h - 4} width={s.cap.w} height="4" fill="#000" opacity="0.25" />}

      {/* label */}
      <rect x={lx} y={ly} width={lw} height={lh} rx="1.5" fill={bottle.label} />
      <rect x={lx + 3} y={ly + 3} width={lw - 6} height={lh - 6} rx="1" fill="none" stroke={bottle.ink} strokeOpacity="0.35" strokeWidth="0.6" />
      <text
        x={cx} y={ly + lh * 0.38} textAnchor="middle"
        style={{ fontFamily: 'var(--font-display), Georgia, serif' }} fontSize={Math.min(16, lw / 3.2)}
        fill={bottle.ink} fontStyle="italic"
      >
        {initials(maker)}
      </text>
      <line x1={cx - lw * 0.18} x2={cx + lw * 0.18} y1={ly + lh * 0.5} y2={ly + lh * 0.5} stroke={bottle.ink} strokeOpacity="0.5" strokeWidth="0.6" />
      <text
        x={cx} y={ly + lh * 0.68} textAnchor="middle"
        style={{ fontFamily: 'var(--font-display), Georgia, serif' }} fontSize={makerSize}
        fill={bottle.ink}
      >
        {shortMaker}
      </text>
      <text
        x={cx} y={ly + lh * 0.84} textAnchor="middle"
        style={{ fontFamily: 'var(--font-sans), sans-serif' }} fontSize="4.6" letterSpacing="0.6"
        fill={bottle.ink} opacity="0.7"
      >
        {product.region.split(',')[0]}
      </text>
    </svg>
  )
}
