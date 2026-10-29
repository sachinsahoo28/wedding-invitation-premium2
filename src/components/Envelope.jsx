import { useEffect, useRef, useState } from 'react'
import { wedding } from '../data/weddingDetails.js'
import { prefersReducedMotion } from '../hooks.js'
import { BlessingMedallion, Lotus } from './Ornaments.jsx'
import { GoldDust } from './Particles.jsx'
import { useMusic } from '../music.jsx'

/*
 * Welcome overlay. ONE tap/click (on the envelope or on "Open Invitation") plays the whole sequence:
 *   1 seal glows → 2 flap swings open in 3D → 3 card rises → 4 hold, then App starts the cinematic hand-off.
 * There is deliberately no skip control, and nothing needs scratching, dragging or swiping.
 */
const TIMELINE = [[650, 2], [1650, 3], [3300, 4]]   // ms → step
const HAND_OFF = 4250                                 // ms after tap, when the overlay starts dissolving

export default function Envelope({ onOpen, leaving }) {
  const [step, setStep] = useState(0)
  const timers = useRef([])
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const music = useMusic()
  const open = () => {
    if (step) return                       // repeat taps do nothing (no second song, no restart)
    music && music.startFromOpen()         // FIRST, synchronously inside the tap, before any timers/animation
    if (prefersReducedMotion()) { setStep(4); later(onOpen, 350); return }
    setStep(1)
    TIMELINE.forEach(([t, n]) => later(() => setStep(n), t))
    later(onOpen, HAND_OFF)
  }

  const initials = `${(wedding.bride || 'B')[0]}&${(wedding.groom || 'G')[0]}`
  return (
    <div className={`env-screen s${step}${leaving ? ' leaving' : ''}`} aria-busy={step > 0}>
      <div className="env-bg" aria-hidden="true" />
      <div className="env-head">
        <BlessingMedallion />
        <p className="shloka" lang="sa">॥ श्री गणेशाय नमः ॥</p>
        <h1 className="env-title">An Invitation <em>From Our Hearts</em></h1>
      </div>

      <div className="env-stage">
        <GoldDust />
        {/* Decorative + tap target for pointer users; the real, keyboard-accessible control is the button below. */}
        <div className="env" onClick={open} aria-hidden="true">
          <span className="env-back" />
          <span className="card">
            <Lotus size={22} className="card-lotus" />
            <span className="cw">Welcome</span>
            <span className="cn">{wedding.bride} &amp; {wedding.groom}</span>
            <span className="cm">Together with our families, we joyfully invite you to celebrate our wedding.</span>
          </span>
          <svg className="env-front" viewBox="0 0 340 224" preserveAspectRatio="none">
            <defs>
              <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FBF1DC" /><stop offset="1" stopColor="#E7D4AD" /></linearGradient>
            </defs>
            <path d="M0 0L170 118L340 0V224H0Z" fill="url(#paper)" />
            <path d="M0 224L128 130M340 224L212 130" stroke="#B08D57" strokeOpacity=".4" fill="none" />
            <path d="M0 0L170 118L340 0" stroke="#B08D57" strokeOpacity=".75" fill="none" />
            {/* side + bottom edges only: the TOP edge belongs to the flap (it swings away), otherwise it would be drawn across the rising card */}
            <path d="M.5 0V224M339.500 0V224M0 223.500H340" stroke="#B08D57" strokeOpacity=".5" fill="none" />
          </svg>
          <span className="flap">
            <span className="flap-in" />
            <span className="flap-out">
              <svg viewBox="0 0 340 122" preserveAspectRatio="none"><path d="M0 .5H340" fill="none" stroke="#B08D57" strokeOpacity=".5" /><path d="M0 0L170 122L340 0" fill="none" stroke="#B08D57" strokeOpacity=".8" /><path d="M30 0L170 98L310 0" fill="none" stroke="#B08D57" strokeOpacity=".4" /></svg>
            </span>
            <span className="seal-wrap"><span className="seal"><b>{initials}</b></span></span>
          </span>
          <span className="hash">{wedding.hashtag}</span>
        </div>
      </div>

      <div className="env-foot">
        <p className="hint" aria-hidden="true">Tap the envelope to open</p>
        <button className="btn btn--primary" onClick={open} disabled={step > 0}>Open Invitation</button>
        <span className="sr-only" role="status">{step > 0 ? 'Opening your invitation' : ''}</span>
      </div>
    </div>
  )
}
