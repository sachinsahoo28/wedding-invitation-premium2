import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { wedding } from './data/weddingDetails.js'
import { asset } from './utils.js'

/*
 * ONE audio element for the whole site, created once here (never re-created on scroll or re-render).
 *
 * The audio element is the single source of truth:
 *  - `phase` mirrors the element's own events: idle | loading | playing | paused | error.
 *    It becomes 'playing' ONLY on the element's `playing` event, so the UI never claims sound that isn't there.
 *  - The button acts on the element's real state (`audio.paused`), not on a remembered intention. A pause that came
 *    from outside the page (lock-screen / headset controls, a phone call, back-forward cache) can therefore never
 *    turn the guest's next tap into a silent no-op.
 *  - `needsTap`: a play request could not start (blocked by the browser, failed to load, or the network stalled).
 *    The button shows a quiet retry halo and the guest's next tap makes ONE fresh attempt. Nothing retries by itself.
 *  - `videoBusy`: the wedding film is playing → music is held, then restored when the film pauses / ends.
 *
 * No autoplay attempt on page load, on purpose: browsers block audible autoplay on a first visit, and where they do
 * allow it (desktop Chrome with high media engagement) the song would start before the envelope is opened. Either
 * way the behaviour would differ from visit to visit. The envelope tap is the one reliable, user-initiated start.
 */
const MusicCtx = createContext(null)
export const useMusic = () => useContext(MusicCtx)

export function MusicProvider({ children }) {
  const src = asset(wedding.music)
  const audioRef = useRef(null)
  const userPausedRef = useRef(false)   // the guest (or their device) paused it → opening the envelope must never restart it
  const wantedRef = useRef(false)       // music should be on; only used to restore it after the wedding film
  const busyRef = useRef(false)         // the wedding film is playing
  const askedRef = useRef(false)        // the guest has asked for music at least once (load errors are announced only after that)
  const stalledRef = useRef(false)      // a start is pending but the network stopped delivering data
  const phaseRef = useRef('idle'), noticeTimer = useRef(0)
  const [phase, setPhaseState] = useState('idle')
  const [needsTap, setNeedsTapState] = useState(false)
  const [videoBusy, setVideoBusy] = useState(false)
  const [notice, setNotice] = useState('')

  // phaseRef mirrors state so the element's listeners (registered once) always read the current value
  const setPhase = useCallback((p) => { phaseRef.current = p; setPhaseState(p) }, [])
  const setNeedsTap = useCallback((v) => setNeedsTapState(v), [])
  const clearNotice = useCallback(() => { clearTimeout(noticeTimer.current); setNotice('') }, [])
  const flash = useCallback((text, ms = 4200) => { setNotice(text); clearTimeout(noticeTimer.current); noticeTimer.current = setTimeout(() => setNotice(''), ms) }, [])

  useEffect(() => {
    if (!src) return undefined
    const a = new Audio()
    a.loop = true
    a.preload = 'auto'      // buffer while the guest is still on the envelope, so tap → first note is near-instant
    a.volume = 0.75         // (iOS ignores volume; harmless)
    a.src = src

    const handlers = {
      // play() accepted (by us or by lock-screen controls): the song is starting, NOT audible yet
      play: () => { userPausedRef.current = false; wantedRef.current = true; setPhase('loading') },
      // the only event that means real sound
      playing: () => { stalledRef.current = false; setNeedsTap(false); clearNotice(); setPhase('playing') },
      waiting: () => { if (!a.paused) setPhase('loading') },                    // buffering mid-song
      progress: () => { if (stalledRef.current) { stalledRef.current = false; setNeedsTap(false) } },   // data flowing again
      stalled: () => {
        if (a.paused || phaseRef.current !== 'loading') return               // background preloading: not the guest's problem
        stalledRef.current = true; setNeedsTap(true)
        flash('The song is taking long to load. Tap the music button to try again')
      },
      pause: () => {
        if (phaseRef.current !== 'error') setPhase('paused')
        // held for the film → keep the wish to resume; any other pause is the guest's (or their device's) choice
        if (!busyRef.current) { userPausedRef.current = true; wantedRef.current = false }
      },
      error: () => {
        stalledRef.current = false; setPhase('error')
        if (askedRef.current) { setNeedsTap(true); flash('The song could not be loaded. Tap the music button to try again') }
      },
    }
    Object.entries(handlers).forEach(([type, fn]) => a.addEventListener(type, fn))

    // Coming back from the back-forward cache or a background tab: the browser may have paused the song without us
    // seeing it. Only ever DOWNGRADE here; 'playing' is still reserved for the element's own `playing` event.
    const sync = () => {
      if (a.error) setPhase('error')
      else if (a.paused && (phaseRef.current === 'playing' || phaseRef.current === 'loading')) setPhase('paused')
    }
    const onPageShow = (e) => { if (e.persisted) sync() }
    const onVisibility = () => { if (document.visibilityState === 'visible') sync() }
    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibility)

    audioRef.current = a
    return () => {
      Object.entries(handlers).forEach(([type, fn]) => a.removeEventListener(type, fn))
      window.removeEventListener('pageshow', onPageShow)
      document.removeEventListener('visibilitychange', onVisibility)
      a.pause(); a.removeAttribute('src'); a.load()
      if (audioRef.current === a) audioRef.current = null
      clearTimeout(noticeTimer.current)
    }
  }, [src, setPhase, setNeedsTap, clearNotice, flash])

  /* Requests playback. MUST be reached synchronously from a tap/click handler so the browser counts the gesture.
     `fresh` = make a new network attempt first (after a failed load or a stall), keeping the song's position. */
  const start = useCallback((fresh) => {
    const a = audioRef.current
    if (!a) return
    askedRef.current = true; userPausedRef.current = false; wantedRef.current = true
    stalledRef.current = false; setNeedsTap(false); clearNotice()
    if (fresh || a.error) {
      const at = a.currentTime
      a.load()
      if (at > 0) { try { a.currentTime = at } catch { /* position restore is best-effort */ } }
    }
    let p
    try { p = a.play() } catch (err) { p = Promise.reject(err) }
    if (!p || typeof p.then !== 'function') return
    p.catch((err) => {
      if (a !== audioRef.current) return                                     // element torn down meanwhile
      const name = err && err.name
      if (name === 'AbortError') {
        // Superseded by our own pause()/load() → the element's events already tell the truth.
        // Dropped by the browser itself (seen on iOS) → nothing will happen unless the guest taps again.
        if (a.paused && !userPausedRef.current && !busyRef.current) { setPhase('paused'); setNeedsTap(true) }
        return
      }
      wantedRef.current = false; setNeedsTap(true)
      if (name === 'NotAllowedError') {                                      // the browser wants a fresh tap: normal, not an error
        if (phaseRef.current !== 'error') setPhase('paused')
        flash('Tap the music button to play the wedding song')
      } else {
        setPhase('error'); flash('The song could not be played. Tap the music button to try again')
      }
    })
  }, [setPhase, setNeedsTap, clearNotice, flash])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!src || !a) { flash('Placeholder: add your wedding song in src/data/weddingDetails.js', 6000); return }
    if (busyRef.current) {                                                   // film playing: decide whether music comes back after it
      const next = !wantedRef.current
      wantedRef.current = next; userPausedRef.current = !next
      flash(next ? 'The music will resume after the video' : 'The music will stay off after the video')
      return
    }
    const failed = phaseRef.current === 'error' || !!a.error
    if (!a.paused && !failed && !stalledRef.current) {                      // playing, or starting normally → stop (cancels a pending start)
      userPausedRef.current = true; wantedRef.current = false
      a.pause()
      return
    }
    start(failed || stalledRef.current)                                      // play() runs inside this tap
  }, [src, flash, start])

  /* Called from the envelope's tap handler, synchronously, so the click still counts as the user gesture.
     No-op when the song is already starting/playing (repeat taps never restart it) or the guest chose silence. */
  const startFromOpen = useCallback(() => {
    const a = audioRef.current
    if (!a || !a.paused || userPausedRef.current) return
    if (busyRef.current) { wantedRef.current = true; return }
    start(phaseRef.current === 'error')
  }, [start])

  const holdForVideo = useCallback(() => {
    busyRef.current = true; setVideoBusy(true)
    const a = audioRef.current
    if (a && !a.paused) a.pause()                                            // wantedRef keeps "resume afterwards"
  }, [])
  const releaseVideo = useCallback(() => {
    if (!busyRef.current) return
    busyRef.current = false; setVideoBusy(false)
    const a = audioRef.current
    if (a && a.paused && wantedRef.current) start(false)                     // restore what the guest had before the film
  }, [start])

  const value = useMemo(() => ({
    available: !!src, phase, needsTap, videoBusy, notice,
    playing: phase === 'playing' && !videoBusy,                              // true only after the element's `playing` event
    toggle, startFromOpen, holdForVideo, releaseVideo,
  }), [src, phase, needsTap, videoBusy, notice, toggle, startFromOpen, holdForVideo, releaseVideo])
  return <MusicCtx.Provider value={value}>{children}</MusicCtx.Provider>
}
