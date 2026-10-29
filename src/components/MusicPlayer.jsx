import { useMusic } from '../music.jsx'
import { NoteIcon, PauseIcon, RetryIcon } from './Ornaments.jsx'

/* One circular icon button, bottom-right. No visible text: state is shown by the icon, ring and glow,
   and announced to screen readers through the aria-label and a visually hidden status line.
   Every visual state comes from the audio element's own events (see music.jsx):
     playing → turning ring, glow, drifting notes (only after the element's `playing` event)
     loading → quiet breathing ring (a start was requested; no sound yet)
     retry   → soft halo: a start was blocked, failed or stalled; the next tap tries once more */
export default function MusicPlayer() {
  const m = useMusic()
  const state = !m.available ? 'missing' : m.videoBusy ? 'video' : m.phase === 'idle' ? 'paused' : m.phase   // playing | loading | paused | error
  const retry = m.available && !m.videoBusy && m.needsTap
  const name = ({
    missing: 'Wedding music placeholder, no song added yet',
    video: 'Wedding music paused while the video plays. Press to change whether it resumes afterwards',
    playing: 'Pause wedding music',
    loading: retry ? 'Wedding music is taking long to load. Press to try again' : 'Wedding music is loading. Press to cancel',
    paused: 'Play wedding music',
    error: 'Wedding music could not be played. Press to try again',
  })[state]
  const status = m.notice || ({ playing: 'Wedding music playing', paused: 'Wedding music paused', loading: 'Loading wedding music', error: 'Wedding music unavailable', missing: 'No wedding song added yet', video: 'Music paused for the video' })[state]
  const title = state === 'missing' ? 'Placeholder: add your song in src/data/weddingDetails.js' : retry || state === 'error' ? 'Tap to play the wedding music' : undefined
  return (
    <div className={`mplayer is-${state}${retry ? ' is-retry' : ''}`}>
      <button type="button" className="m-btn" onClick={m.toggle} aria-label={name} aria-pressed={m.available ? m.playing : undefined} title={title}>
        <svg className="m-ring" viewBox="-30 -30 60 60" aria-hidden="true" focusable="false">
          <circle r="27" fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray="1.4 3.2" />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d="M0-29.500l1.600 1.600-1.600 1.600-1.600-1.600z" fill="currentColor" transform={`rotate(${i * 45})`} />)}
        </svg>
        <span className="m-ico m-note"><NoteIcon size={22} /></span>
        <span className="m-ico m-pause"><PauseIcon /></span>
        <span className="m-ico m-retry"><RetryIcon /></span>
        <span className="m-float" aria-hidden="true"><i>♪</i><i>♫</i></span>
      </button>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </div>
  )
}
