import { useId, useState } from 'react'
import { wedding } from '../data/weddingDetails.js'
import { useInView } from '../hooks.js'
import Photo from './Photo.jsx'
import { ButterflyMark, DoorIcon } from './Ornaments.jsx'

/* One half of the double door. Both halves draw the same 200×290 artwork; each shows its own half,
   so the closed doors read as a single gold butterfly that splits when they open. */
function DoorArt({ half }) {
  const id = (useId() || '').replace(/[^a-zA-Z0-9]/g, '')
  const gold = `url(#${id}g)`, wingId = `${id}w`
  return (
    <svg className="door-art" viewBox={half === 'left' ? '0 0 100 290' : '100 0 100 290'} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id + 'g'} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F1E2BC" /><stop offset=".5" stopColor="#C9A66B" /><stop offset="1" stopColor="#8F6F3C" /></linearGradient>
        <pattern id={id + 'j'} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M7 0V14M0 7H14" stroke="#E7D4AD" strokeWidth=".5" opacity=".5" /><circle cx="7" cy="7" r="1.600" fill="none" stroke="#E7D4AD" strokeWidth=".5" opacity=".7" />
        </pattern>
        <g id={wingId} strokeLinejoin="round">
          <path d="M102 122C108 92 140 58 168 62C190 66 186 100 164 118C148 130 120 130 102 126Z" fill={gold} stroke="#F1E2BC" strokeWidth=".8" />
          <path d="M102 130C124 130 150 138 156 158C160 176 140 186 124 172C112 162 104 148 102 130Z" fill={gold} stroke="#F1E2BC" strokeWidth=".8" />
          <path d="M108 118C116 96 138 76 160 76C170 78 168 98 154 108C142 116 124 120 108 118Z" fill="#65253B" stroke="#F1E2BC" strokeWidth=".6" />
          <path d="M110 134C126 136 142 142 146 156C147 164 138 168 130 160C122 152 114 146 110 134Z" fill="#65253B" stroke="#F1E2BC" strokeWidth=".6" />
          <circle cx="157" cy="90" r="4.500" fill={gold} /><circle cx="141" cy="104" r="3" fill={gold} /><circle cx="127" cy="113" r="2" fill={gold} /><circle cx="136" cy="155" r="2.800" fill={gold} />
        </g>
      </defs>

      {/* arched border, inner arch, jaali field */}
      <path d="M6 290V100A94 94 0 0 1 194 100V290" fill="none" stroke={gold} strokeWidth="2" />
      <path d="M14 290V100A86 86 0 0 1 186 100V290" fill="none" stroke="#E7D4AD" strokeWidth=".6" opacity=".7" />
      <path d="M22 284V100A78 78 0 0 1 178 100V284Z" fill={`url(#${id}j)`} opacity=".55" />
      <path d="M22 284V100A78 78 0 0 1 178 100V284" fill="none" stroke="#E7D4AD" strokeWidth=".8" opacity=".85" />
      {/* studs around the inner arch */}
      {Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (1 - i / 12); return <circle key={i} cx={100 + 70 * Math.cos(a)} cy={100 - 70 * Math.sin(a)} r="1.700" fill={gold} /> })}
      {[130, 160, 190].map((y) => (<g key={y}><circle cx="30" cy={y} r="1.700" fill={gold} /><circle cx="170" cy={y} r="1.700" fill={gold} /></g>))}

      {/* butterfly */}
      <circle cx="100" cy="128" r="62" fill="#452237" opacity=".55" />
      <use href={'#' + wingId} />
      <use href={'#' + wingId} transform="translate(200 0) scale(-1 1)" />
      <ellipse cx="100" cy="140" rx="3.400" ry="25" fill={gold} stroke="#F1E2BC" strokeWidth=".5" /><circle cx="100" cy="113" r="4" fill={gold} />
      <path d="M99 111C94 98 86 94 82 92M101 111C106 98 114 94 118 92" fill="none" stroke={gold} strokeWidth="1.200" strokeLinecap="round" /><circle cx="82" cy="92" r="1.800" fill={gold} /><circle cx="118" cy="92" r="1.800" fill={gold} />

      {/* lower band + handles */}
      <path d="M22 208H178M22 213H178" stroke={gold} strokeWidth=".8" fill="none" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${34 + i * 22} 219l5 5-5 5-5-5z`} fill="none" stroke="#E7D4AD" strokeWidth=".7" opacity=".85" />)}
      <path d="M22 238H178" stroke="#E7D4AD" strokeWidth=".4" opacity=".6" />
      <circle cx={half === 'left' ? 88 : 112} cy="258" r="8" fill="none" stroke={gold} strokeWidth="1.200" /><circle cx={half === 'left' ? 88 : 112} cy="258" r="4.500" fill={gold} />
      <path d="M100 6V290" stroke={gold} strokeWidth="1.400" />
    </svg>
  )
}

export default function Doors() {
  const [ref, seen] = useInView({ threshold: 0.25, rootMargin: '0px 0px -8% 0px' })
  const [open, setOpen] = useState(false)
  const src = wedding.photos.reveal || wedding.photos.hero
  const openDoors = () => setOpen(true)           // tapping the doors only opens; closing is an explicit action
  return (
    <section ref={ref} className={'doors' + (seen ? ' seen' : '') + (open ? ' open' : '')} aria-labelledby="doors-title">
      <p className="kicker" id="doors-title">Step into our story</p>
      <div className="doors-stage">
        <div className="arch-door" role="group" aria-label="Royal doors" onClick={openDoors}>
          <div className="room">
            <Photo src={src} label="photos.reveal" alt="The couple" position="center 30%" />
            <div className="light" />
          </div>
          <div className="door left"><DoorArt half="left" /></div>
          <div className="door right"><DoorArt half="right" /></div>
          <i className="tap-ring" aria-hidden="true" />
        </div>
        {open && [0, 1, 2].map((i) => <ButterflyMark key={i} className={'fly fly' + i} />)}
      </div>
      <div className="doors-actions">
        {!open
          ? <button className="btn btn--primary" aria-expanded="false" onClick={openDoors}><DoorIcon />Open Royal Doors</button>
          : <button className="btn btn--ghost" aria-expanded="true" onClick={() => setOpen(false)}>Close Doors</button>}
      </div>
    </section>
  )
}
