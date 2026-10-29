import { useState } from 'react'
import { wedding } from '../../data/weddingDetails.js'
import { addressLines, asset, mapsLink } from '../../utils.js'
import { useInView } from '../../hooks.js'
import SectionHeading from '../SectionHeading.jsx'
import { PinIcon } from '../Ornaments.jsx'
import { Petals } from '../Particles.jsx'

/* Gateway line-art. Paths use pathLength=1 so CSS can "draw" them. */
const ArchArt = () => (
  <svg className="venue-arch" viewBox="0 0 240 206" role="img" aria-label="Ornamental arch" focusable="false">
    <g fill="none" stroke="#B08D57" strokeWidth="1.600" strokeLinecap="round" strokeLinejoin="round">
      <path className="dr" pathLength="1" d="M24 198H216" />
      <path className="dr" pathLength="1" d="M42 198V106C42 52 92 30 120 18C148 30 198 52 198 106V198" />
      <path className="dr d2" pathLength="1" d="M60 198V110C60 66 98 46 120 36C142 46 180 66 180 110V198" strokeWidth="1" />
      <path className="dr d2" pathLength="1" d="M82 198V126C82 106 96 98 106 106C110 86 130 86 134 106C144 98 158 106 158 126V198" />
      <path className="dr d3" pathLength="1" d="M120 18V8M114 12H126" />
      <circle className="fd" cx="120" cy="5" r="3" />
      <g className="fd" strokeWidth="1" transform="translate(120 70)">
        {[-62, -31, 0, 31, 62].map((r) => <path key={r} d="M0 0C3.400-5 3.400-11 0-16C-3.400-11-3.400-5 0 0Z" transform={`rotate(${r}) scale(1.300)`} />)}
      </g>
    </g>
  </svg>
)

export default function Venue() {
  const [ref, seen] = useInView({ threshold: 0.18, rootMargin: '0px 0px -10% 0px' })
  const [photoOk, setPhotoOk] = useState(true)
  const v = wedding.venue
  const lines = addressLines()
  const hasPhoto = !!v.photo && photoOk
  // Sequence index → CSS delay (see venue.css). Photo only occupies a slot when one exists.
  const buttonSlot = lines.length + (hasPhoto ? 1 : 0)
  return (
    <section ref={ref} className={'venue sec' + (seen ? ' seen' : '')} aria-labelledby="venue-title">
      <Petals active={seen} />
      <SectionHeading id="venue-title" eyebrow="Join us at" lead="The" em="Venue" />
      <div className="venue-card">
        <div className="venue-arch-wrap"><ArchArt /></div>
        <h3 className="venue-name"><span>{v.name}</span></h3>
        <span className="gold-line" aria-hidden="true" />
        <address className="venue-address">
          {lines.map((l, i) => <span key={l + i} className="al" style={{ '--i': i }}>{l}</span>)}
        </address>
        {hasPhoto && (
          <figure className="venue-photo" style={{ '--i': lines.length }}>
            <img src={asset(v.photo)} alt={v.photoAlt || 'The wedding venue'} loading="lazy" decoding="async" onError={() => setPhotoOk(false)} />
          </figure>
        )}
        <div className="venue-cta" style={{ '--i': buttonSlot }}>
          <a className="btn btn--primary" href={mapsLink()} target="_blank" rel="noopener noreferrer"><PinIcon />View Location</a>
        </div>
      </div>
    </section>
  )
}
