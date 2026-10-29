import { useEffect, useRef, useState } from 'react'
import { wedding } from '../../data/weddingDetails.js'
import { calendarUrl, dateParts, dateText } from '../../utils.js'
import { prefersReducedMotion } from '../../hooks.js'
import Reveal from '../Reveal.jsx'
import SectionHeading from '../SectionHeading.jsx'
import { CalendarIcon, Corners, Lotus } from '../Ornaments.jsx'

function useCountdown(target, active) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!active) return undefined
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [active])
  const s = Math.max(0, Math.floor((new Date(target) - now) / 1000)) || 0
  return { Days: Math.floor(s / 86400), Hours: Math.floor(s / 3600) % 24, Minutes: Math.floor(s / 60) % 60, Seconds: s % 60 }
}

export default function DateReveal() {
  const [st, setSt] = useState('sealed') // sealed → opening → open
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const reveal = () => {
    if (st !== 'sealed') return
    if (prefersReducedMotion()) return setSt('open')
    setSt('opening'); timer.current = setTimeout(() => setSt('open'), 1000)
  }
  const cd = useCountdown(wedding.date, st !== 'sealed')
  const p = dateParts()
  return (
    <section className="date sec" aria-labelledby="date-title">
      <SectionHeading id="date-title" lead="Save the" em="Date" />
      <Reveal>
        <div className={'datecard ' + st}>
          <Corners />
          <div className="dc-inner" aria-hidden={st === 'sealed'}>
            <p className="dc-weekday">{p.weekday}</p>
            <p className="dc-month">{p.month}</p>
            <p className="dc-day"><i aria-hidden="true" />{p.day}<i aria-hidden="true" /></p>
            <p className="dc-year">{p.year}</p>
            {p.time && <p className="dc-time">{p.time}</p>}
            <span className="sr-only">{dateText()}</span>
          </div>
          {st !== 'open' && (
            <div className="dc-veil" aria-hidden="true" onClick={reveal}>
              <i className="half l" /><i className="half r" />
              <span className="dc-seal"><Lotus size={34} stroke="#E7D4AD" /></span>
            </div>
          )}
        </div>
      </Reveal>
      {st === 'sealed' && <Reveal delay={150}><button className="btn btn--primary" onClick={reveal}>Reveal Wedding Date</button></Reveal>}
      {st !== 'sealed' && (
        <div className="date-after">
          <div className="countdown" role="timer" aria-label="Countdown to the wedding">
            {Object.entries(cd).map(([k, v]) => <div key={k}><b>{String(v).padStart(2, '0')}</b><span>{k}</span></div>)}
          </div>
          <a className="btn btn--primary" href={calendarUrl()} target="_blank" rel="noopener noreferrer"><CalendarIcon />Add to Calendar</a>
        </div>
      )}
    </section>
  )
}
