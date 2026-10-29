import { useId } from 'react'

const GOLD = '#B08D57'
const uid = (raw) => raw.replace(/[^a-zA-Z0-9]/g, '')

/* ---------- small motifs ---------- */
const petalPath = 'M0 0C3.4-5 3.4-11 0-16C-3.4-11-3.4-5 0 0Z'
export function Lotus({ size = 26, className = '', stroke = 'currentColor' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="-14 -20 28 24" fill="none" stroke={stroke} strokeWidth="1" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {[-62, -31, 0, 31, 62].map((r) => <path key={r} d={petalPath} transform={`rotate(${r})`} />)}
      <path d="M-10 2.5C-4 4.5 4 4.5 10 2.5" />
    </svg>
  )
}

const paisley = 'M0 0C9-2 14 6 10 14C7 20-2 20-4 13C-5.500 8 0 5 3 8C5 10 3 12 1 11'
export function Paisley({ size = 20, className = '', flip = false }) {
  return (
    <svg className={className} width={size} height={size} viewBox="-6 -4 22 26" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true" focusable="false">
      <path d={paisley} /><circle cx="6.500" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ButterflyMark({ className = '', style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 48 40" width="30" height="25" aria-hidden="true" focusable="false">
      <g fill="#E7D4AD" stroke={GOLD} strokeWidth="1" strokeLinejoin="round">
        <path d="M24 19C26 8 36 2 43 5C47 8 44 18 36 22C31 24 27 22 24 20Z" />
        <path d="M24 21C30 22 37 25 38 31C38 36 32 38 28 33C25 30 24 26 24 21Z" />
        <path d="M24 19C22 8 12 2 5 5C1 8 4 18 12 22C17 24 21 22 24 20Z" />
        <path d="M24 21C18 22 11 25 10 31C10 36 16 38 20 33C23 30 24 26 24 21Z" />
      </g>
      <path d="M24 12v18" stroke="#65253B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* ---------- layered ornamental divider ---------- */
export function Divider({ className = '' }) {
  const id = uid(useId())
  return (
    <svg className={'divider ' + className} viewBox="0 0 320 30" role="presentation" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id + 'l'} gradientUnits="userSpaceOnUse" x1="8" y1="0" x2="128" y2="0"><stop offset="0" stopColor={GOLD} stopOpacity="0" /><stop offset="1" stopColor={GOLD} /></linearGradient>
        <linearGradient id={id + 'r'} gradientUnits="userSpaceOnUse" x1="312" y1="0" x2="192" y2="0"><stop offset="0" stopColor={GOLD} stopOpacity="0" /><stop offset="1" stopColor={GOLD} /></linearGradient>
      </defs>
      <g fill="none" strokeWidth="1">
        <path d="M8 15H128" stroke={`url(#${id}l)`} /><path d="M312 15H192" stroke={`url(#${id}r)`} />
        <path d="M34 20H122" stroke={`url(#${id}l)`} opacity=".55" /><path d="M286 20H198" stroke={`url(#${id}r)`} opacity=".55" />
      </g>
      <g transform="translate(160 22)" fill="none" stroke={GOLD} strokeWidth="1" strokeLinejoin="round">
        {[-62, -31, 0, 31, 62].map((r) => <path key={r} d={petalPath} transform={`rotate(${r}) scale(.78)`} />)}
        <path d="M-34 -7l4-4 4 4-4 4zM30 -7l4-4 4 4-4 4z" />
        <path d="M-50 -7c5-2 8 3 6 7M50 -7c-5-2-8 3-6 7" />
      </g>
    </svg>
  )
}

/* ---------- corner floral (rotated via CSS for the other three corners) ---------- */
export function CornerFloral({ className = '' }) {
  return (
    <svg className={'corner ' + className} viewBox="0 0 84 84" width="84" height="84" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M3 3H80M3 3V80" opacity=".85" />
      <path d="M9 9H44M9 9V44" opacity=".45" />
      <g transform="translate(23 23)">
        {[0, 60, 120, 180, 240, 300].map((r) => <ellipse key={r} cx="0" cy="-7" rx="3.200" ry="6.500" transform={`rotate(${r})`} />)}
        <circle r="2.200" fill="currentColor" stroke="none" />
      </g>
      <path d="M35 23C50 23 56 14 70 14M23 35C23 50 14 56 14 70" />
      <path d="M70 14c-3-4-9-4-11-3c1 4 6 6 11 3zM14 70c-4-3-4-9-3-11c4 1 6 6 3 11z" />
      <circle cx="46" cy="21" r="1.200" fill="currentColor" stroke="none" /><circle cx="21" cy="46" r="1.200" fill="currentColor" stroke="none" />
    </svg>
  )
}

/* Four corners for framed panels */
export const Corners = () => (<><CornerFloral className="tl" /><CornerFloral className="tr" /><CornerFloral className="bl" /><CornerFloral className="br" /></>)

/* ---------- Ganesh blessing medallion (Om inside a lotus ring) ---------- */
export function BlessingMedallion() {
  return (
    <div className="medallion" role="img" aria-label="Ganesh blessing">
      <svg viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
        <circle r="46" fill="none" stroke={GOLD} strokeWidth=".8" />
        <circle r="41.500" fill="none" stroke={GOLD} strokeWidth=".5" strokeDasharray="1 3" />
        <g fill="none" stroke={GOLD} strokeWidth=".9" strokeLinejoin="round">
          {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0-30C4-35 4-42 0-46C-4-42-4-35 0-30Z" transform={`rotate(${i * 30})`} />)}
        </g>
        <circle r="27" fill="#FFF9EF" stroke={GOLD} strokeWidth=".8" />
      </svg>
      <span className="om" aria-hidden="true">ॐ</span>
    </div>
  )
}

/* ---------- icons (stroke, inherit currentColor) ---------- */
const I = ({ children, size = 18 }) => (
  <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.600" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
)
export const PinIcon = () => <I><path d="M12 21s7-6.100 7-11.500A7 7 0 0 0 5 9.500C5 14.900 12 21 12 21z" /><circle cx="12" cy="9.500" r="2.500" /></I>
export const CalendarIcon = () => <I><rect x="4" y="5" width="16" height="15" rx="1.500" /><path d="M4 10h16M9 3v4M15 3v4M12 13v4M10 15h4" /></I>
export const ChatIcon = () => <I><path d="M5 19l1.200-3.600A7.500 7.500 0 1 1 9 18z" /><path d="M9.500 9.500c.5 2.500 2.500 4.500 5 5l1-1.500-2-1-.8.800c-.8-.4-1.600-1.200-2-2l.8-.8-1-2z" /></I>
export const LinkIcon = () => <I><path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1" /><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" /></I>
export const CopyIcon = () => <I><rect x="8" y="8" width="12" height="12" rx="1.500" /><path d="M16 8V5.500A1.500 1.500 0 0 0 14.500 4h-9A1.500 1.500 0 0 0 4 5.500v9A1.500 1.500 0 0 0 5.500 16H8" /></I>
export const ShareIcon = () => <I><circle cx="6" cy="12" r="2.500" /><circle cx="18" cy="6" r="2.500" /><circle cx="18" cy="18" r="2.500" /><path d="M8.300 10.800l7.400-3.600M8.300 13.200l7.400 3.600" /></I>
export const ArrowUpIcon = () => <I><path d="M12 19V5M6 11l6-6 6 6" /></I>
export const DoorIcon = () => <I><path d="M5 21V10a7 7 0 0 1 14 0v11M12 3v18M3 21h18" /></I>
export const CheckIcon = () => <I><path d="M5 12.500l4.500 4.500L19 7.500" /></I>
export const PlayIcon = () => (<svg className="ico" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5.500v13a1 1 0 0 0 1.500.860l10.500-6.500a1 1 0 0 0 0-1.720L9.500 4.640A1 1 0 0 0 8 5.500z" /></svg>)
export const PauseIcon = () => (<svg className="ico" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>)
export const NoteIcon = ({ size = 20 }) => <I size={size}><path d="M9 18V6l10-2v12" /><circle cx="6.500" cy="18" r="2.500" /><circle cx="16.500" cy="16" r="2.500" /></I>
export const RetryIcon = ({ size = 20 }) => <I size={size}><path d="M19.500 12a7.500 7.500 0 1 1-2.200-5.300" /><path d="M19.500 4v4h-4" /></I>

/* ---------- timeline event glyphs ---------- */
export function EventIcon({ name = '' }) {
  const n = name.toLowerCase()
  const common = { width: 22, height: 22, viewBox: '-12 -12 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.100, strokeLinejoin: 'round', strokeLinecap: 'round', 'aria-hidden': true, focusable: false }
  if (n.includes('haldi')) return (<svg {...common}>{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cy="-6.500" rx="2.200" ry="4" transform={`rotate(${i * 45})`} />)}<circle r="2.200" /></svg>)
  if (n.includes('mehendi') || n.includes('mehndi')) return (<svg {...common}><path d="M-3-9C7-9 9 0 5 6C2 10-5 9-6 4C-7-1-2-3 1 0C3 2 1 4-1 3" /><circle cx="-2.500" cy="-9" r="0.800" fill="currentColor" stroke="none" /></svg>)
  if (n.includes('sangeet')) return (<svg {...common}><path d="M-3 7V-7L7-9V5" /><circle cx="-6" cy="7" r="3" /><circle cx="4" cy="5" r="3" /></svg>)
  if (n.includes('wedding') || n.includes('ceremony') || n.includes('phera')) return (<svg {...common}><circle cx="-3.500" cy="1" r="6" /><circle cx="3.500" cy="1" r="6" /><path d="M-2-9l2-2 2 2-2 2z" /></svg>)
  if (n.includes('reception')) return (<svg {...common}><path d="M0-10C1 -4 4-1 10 0C4 1 1 4 0 10C-1 4-4 1-10 0C-4-1-1-4 0-10Z" /></svg>)
  return <Lotus size={22} />
}
