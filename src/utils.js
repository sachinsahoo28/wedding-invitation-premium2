import { wedding } from './data/weddingDetails.js'
// ── Personalised links ───────────────────────────────────────────────────────────────────
// Canonical params: ?guest=Rahul%20Ji&family=Family   (never put phone numbers in links).
// Legacy params from the first version (?to=…&fam=…&g=…) are still READ so links already sent keep working.
const MAX_LEN = 60
export const clean = (v) =>
  Array.from(String(v ?? '')
    .replace(/[\u0000-\u001F\u007F\uFFFD<>]/g, '')   // control chars, broken-encoding marker, angle brackets
    .replace(/\s+/g, ' ').trim())
    .slice(0, MAX_LEN).join('').trim()                  // Array.from = cut on characters, not UTF-16 halves
// A value with broken percent-encoding (decodes to U+FFFD) is ignored entirely rather than half-shown.
const first = (q, ...keys) => { for (const k of keys) { const raw = q.get(k); if (raw == null || raw.includes('\uFFFD')) continue; const v = clean(raw); if (v) return v } return '' }

/** Safe to call anywhere; never throws. `personalized` is true only when a usable name is present. */
export function getGuest(search = typeof window !== 'undefined' ? window.location.search : '') {
  let q
  try { q = new URLSearchParams(search) } catch { q = new URLSearchParams('') }
  const guest = first(q, 'guest', 'to'), family = first(q, 'family', 'fam'), custom = first(q, 'g')
  const name = guest && family ? `${guest} & ${family}` : guest || family
  const personalized = !!name
  const greeting = personalized ? (custom ? `${custom} ${name}` : `Dear ${name}`) : wedding.defaultGreeting
  return { name, greeting, personalized }
}
export const dateText = () => new Date(wedding.date).toLocaleDateString('en-IN', { timeZone: wedding.timeZone, day: 'numeric', month: 'long', year: 'numeric' })
export function buildLink(guest, family) {
  let url
  try { url = new URL(wedding.inviteBaseUrl || window.location.href) } catch { url = new URL(window.location.href) }
  url.search = ''; url.hash = ''                         // start from the bare invitation address
  const g = clean(guest), f = clean(family)
  if (g) url.searchParams.set('guest', g)               // URL API percent-encodes the values
  if (f) url.searchParams.set('family', f)
  url.search = url.searchParams.toString().replace(/\+/g, '%20')   // '%20' (not '+') for spaces: most readable in chats
  return url.toString()
}
export function buildMessage(greet, link) {
  return `${greet} 🙏\n\nWith love, we invite you to celebrate the wedding of ${wedding.bride} & ${wedding.groom} on ${dateText()}.\n\nPlease open your personalized invitation:\n${link}\n\nWe look forward to celebrating with you!`
}
export function calendarUrl() {
  const f = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '')
  const s = new Date(wedding.date), e = new Date(s.getTime() + 4 * 3600e3)
  const p = new URLSearchParams({ action: 'TEMPLATE', text: `${wedding.bride} & ${wedding.groom} Wedding`, dates: `${f(s)}/${f(e)}`, location: `${wedding.venue.name}, ${wedding.venue.address}` })
  return 'https://calendar.google.com/calendar/render?' + p
}

// --- additions for the redesigned sections -------------------------------------------------
const validDate = () => { const d = new Date(wedding.date); return Number.isNaN(d.getTime()) ? null : d }
export function dateParts() {
  const d = validDate()
  if (!d) return { weekday: '', day: '', month: '', year: '', time: '' }
  const f = (o) => d.toLocaleDateString('en-IN', { timeZone: wedding.timeZone, ...o })
  const time = d.toLocaleTimeString('en-IN', { timeZone: wedding.timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase()
  return { weekday: f({ weekday: 'long' }), day: f({ day: 'numeric' }), month: f({ month: 'long' }), year: f({ year: 'numeric' }), time }
}
// 'Date · Time' -> { when, at }. Anything without the dot is shown as a single line.
export function splitWhen(t = '') {
  const [when, ...rest] = t.split('·').map((x) => x.trim())
  return { when: when || '', at: rest.join(' · ') }
}
export const addressLines = () => (wedding.venue.address || '').split(',').map((x) => x.trim()).filter(Boolean)
// Uses the configured Maps link; if it is empty, builds a Google Maps search from the venue name + address.
export function mapsLink() {
  if (wedding.venue.mapsUrl) return wedding.venue.mapsUrl
  const q = [wedding.venue.name, wedding.venue.address].filter(Boolean).join(', ')
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q)
}
// Resolves '/hero.jpg' or 'hero.jpg' against Vite's base ('./'), so media works on GitHub Pages sub-paths.
export function asset(p) {
  if (!p) return ''
  if (/^(https?:)?\/\//.test(p) || p.startsWith('data:') || p.startsWith('blob:')) return p
  const base = import.meta.env.BASE_URL || './'
  return base + p.replace(/^\.?\/+/, '')
}
