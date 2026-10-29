/* Restrained, one-shot particle effects (no ambient looping over the whole page). */

// Soft golden motes that drift up once when the envelope opens.
const motes = Array.from({ length: 20 }, (_, i) => ({
  x: ((i * 37) % 100) - 50,          // % horizontal drift origin
  s: 2 + (i % 4),                     // px size
  d: 2.2 + (i % 5) * 0.45,            // s duration
  t: (i % 7) * 0.16,                  // s delay
  y: 70 + ((i * 13) % 70),            // px travel
}))
export function GoldDust() {
  return (
    <div className="dust-field" aria-hidden="true">
      {motes.map((m, i) => (
        <i key={i} className="mote" style={{ '--x': m.x + '%', '--s': m.s + 'px', '--d': m.d + 's', '--t': m.t + 's', '--y': m.y + 'px' }} />
      ))}
    </div>
  )
}

// A few petals that fall once across the venue section when it is first reached.
const petals = Array.from({ length: 7 }, (_, i) => ({ l: 8 + i * 13, d: 7 + (i % 3) * 1.6, t: 0.6 + i * 0.5, r: (i % 2 ? 1 : -1) * (40 + i * 18) }))
export function Petals({ active }) {
  if (!active) return null
  return (
    <div className="petal-field" aria-hidden="true">
      {petals.map((p, i) => (
        <i key={i} className="petal" style={{ left: p.l + '%', '--d': p.d + 's', '--t': p.t + 's', '--r': p.r + 'deg' }} />
      ))}
    </div>
  )
}
