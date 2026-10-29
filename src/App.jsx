import { useEffect, useRef, useState } from 'react'
import Envelope from './components/Envelope.jsx'
import Invitation from './components/Invitation.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import { MusicProvider } from './music.jsx'
import { prefersReducedMotion } from './hooks.js'

/*
 * phase: 'envelope' (welcome overlay) → 'leaving' (cinematic dissolve, invitation mounts underneath) → 'invite'.
 * The royal doors are NOT a phase any more: they live inside <Invitation/> and wake up only when scrolled into view.
 */
const LEAVE_MS = 1400

export default function App() {
  const [phase, setPhase] = useState('envelope')
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', phase !== 'invite')
    return () => document.documentElement.classList.remove('is-locked')
  }, [phase])

  const handOff = () => {
    window.scrollTo(0, 0)
    if (prefersReducedMotion()) return setPhase('invite')
    setPhase('leaving')
    timer.current = setTimeout(() => setPhase('invite'), LEAVE_MS)
  }
  return (
    <MusicProvider>
      {phase !== 'envelope' && <Invitation ready={phase === 'invite'} />}
      {phase !== 'invite' && <Envelope leaving={phase === 'leaving'} onOpen={handOff} />}
      <MusicPlayer />
    </MusicProvider>
  )
}
