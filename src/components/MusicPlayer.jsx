import { useMusic } from '../music.jsx'
import { NoteIcon, PauseIcon } from './Ornaments.jsx'

/* One circular icon button, bottom-right. No visible text: state is shown by the icon, ring and glow,
   and announced to screen readers through the aria-label and a visually hidden status line. */
export default function MusicPlayer() {
  const m = useMusic()
  const state = !m.available ? 'missing' : m.videoBusy ? 'video' : m.phase === 'error' ? 'error' : m.on ? (m.phase === 'playing' ? 'playing' : 'loading') : 'paused'
  const name = state === 'missing' ? 'Wedding music placeholder, no song added yet'
    : state === 'video' ? 'Wedding music paused while the video plays. Press to change whether it resumes afterwards'
    : m.on ? 'Pause wedding music' : 'Play wedding music'
  const status = m.notice || ({ playing: 'Wedding music playing', paused: 'Wedding music paused', loading: 'Loading wedding music', error: 'Wedding music unavailable', missing: 'No wedding song added yet', video: 'Music paused for the video' })[state]
  return (
    <div className={`mplayer is-${state}`}>
      <button type="button" className="m-btn" onClick={m.toggle} aria-label={name} aria-pressed={m.available ? m.on : undefined} title={state === 'missing' ? 'Placeholder: add your song in src/data/weddingDetails.js' : undefined}>
        <svg className="m-ring" viewBox="-30 -30 60 60" aria-hidden="true" focusable="false">
          <circle r="27" fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray="1.4 3.2" />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d="M0-29.500l1.600 1.600-1.600 1.600-1.600-1.600z" fill="currentColor" transform={`rotate(${i * 45})`} />)}
        </svg>
        <span className="m-ico m-note"><NoteIcon size={22} /></span>
        <span className="m-ico m-pause"><PauseIcon /></span>
        <span className="m-float" aria-hidden="true"><i>♪</i><i>♫</i></span>
      </button>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </div>
  )
}
