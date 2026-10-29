import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { wedding } from './data/weddingDetails.js'
import { asset } from './utils.js'

/*
 * ONE audio element for the whole site, owned here (never re-created on scroll or re-render).
 *  - `wanted`   : what the guest asked for (play / pause). Music never starts without a tap.
 *  - `phase`    : what the audio element is REALLY doing, driven by its own events.
 *  - `videoBusy`: the wedding video is playing → music is held, then restored when the video pauses/ends.
 * Components read `on` (really playing / starting) so the button can never disagree with the sound.
 */
const MusicCtx = createContext(null)
export const useMusic = () => useContext(MusicCtx)

export function MusicProvider({ children }) {
  const src = asset(wedding.music)
  const audioRef = useRef(null)
  const userPausedRef = useRef(false)          // the guest paused on purpose → opening/scrolling must never restart it
  const wantedRef = useRef(false), busyRef = useRef(false), phaseRef = useRef('idle'), noticeTimer = useRef(0)
  const [phase, setPhaseState] = useState('idle')          // idle | loading | playing | paused | error
  const [wanted, setWantedState] = useState(false)
  const [videoBusy, setVideoBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const setPhase = (p) => { phaseRef.current = p; setPhaseState(p) }
  const setWanted = (w) => { wantedRef.current = w; setWantedState(w) }
  const flash = useCallback((text, ms = 4200) => { setNotice(text); clearTimeout(noticeTimer.current); noticeTimer.current = setTimeout(() => setNotice(''), ms) }, [])

  useEffect(() => {
    if (!src) return undefined
    const a = new Audio()
    a.loop = true; a.preload = 'none'; a.volume = 0.75; a.src = src      // nothing is downloaded until the first tap
    const on = (t, f) => a.addEventListener(t, f)
    on('play', () => setPhase('loading'))
    on('playing', () => { setPhase('playing'); clearTimeout(noticeTimer.current); setNotice('') })   // real sound: drop stale hints
    on('waiting', () => { if (!a.paused) setPhase('loading') })
    on('pause', () => setPhase(phaseRef.current === 'error' ? 'error' : 'paused'))
    on('error', () => { setWanted(false); setPhase('error'); flash('The song could not be loaded') })
    audioRef.current = a
    return () => { a.pause(); a.removeAttribute('src'); a.load(); audioRef.current = null; clearTimeout(noticeTimer.current) }
  }, [src, flash])

  const tryPlay = useCallback((quiet = false) => {
    const a = audioRef.current; if (!a) return
    const p = a.play()
    if (p && p.catch) p.catch((err) => {
      if (err && err.name === 'AbortError') return                 // a quick pause() interrupted play(): not an error
      setWanted(false)
      if (err && err.name === 'NotAllowedError') { setPhase('paused'); if (!quiet) flash('Tap the music button again to play') }   // blocked autoplay is normal: stay silent
      else { setPhase('error'); flash('The song could not be played') }
    })
  }, [flash])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!src || !a) { flash('Placeholder: add your wedding song in src/data/weddingDetails.js', 6000); return }
    const next = !wantedRef.current
    setWanted(next); userPausedRef.current = !next
    if (next) {
      if (phaseRef.current === 'error') a.load()                   // retry after a failed load
      if (busyRef.current) flash('Music will resume after the video'); else { clearTimeout(noticeTimer.current); setNotice(''); tryPlay() }   // play() runs inside the tap
    } else a.pause()
  }, [src, flash, tryPlay])

  /* Called from the envelope's tap handler, synchronously, so the click still counts as the user gesture.
     No-ops when music is already wanted/playing (repeat taps never restart it) or the guest paused it themselves. */
  const startFromOpen = useCallback(() => {
    if (!audioRef.current || wantedRef.current || userPausedRef.current) return
    setWanted(true)
    if (!busyRef.current) tryPlay(true)
  }, [tryPlay])

  const holdForVideo = useCallback(() => {
    busyRef.current = true; setVideoBusy(true)
    const a = audioRef.current; if (a && !a.paused) a.pause()
  }, [])
  const releaseVideo = useCallback(() => {
    if (!busyRef.current) return
    busyRef.current = false; setVideoBusy(false)
    if (wantedRef.current) tryPlay()                                // restore whatever the guest had before the video
  }, [tryPlay])

  const value = useMemo(() => ({
    available: !!src, phase, wanted, videoBusy, notice, toggle, startFromOpen, holdForVideo, releaseVideo,
    on: !videoBusy && (phase === 'playing' || (wanted && phase === 'loading')),
  }), [src, phase, wanted, videoBusy, notice, toggle, startFromOpen, holdForVideo, releaseVideo])
  return <MusicCtx.Provider value={value}>{children}</MusicCtx.Provider>
}
