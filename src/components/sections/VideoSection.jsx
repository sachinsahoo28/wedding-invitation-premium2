import { useEffect, useRef, useState } from 'react'
import { useMusic } from '../../music.jsx'
import { wedding } from '../../data/weddingDetails.js'
import { asset } from '../../utils.js'
import { useInView } from '../../hooks.js'
import SectionHeading from '../SectionHeading.jsx'
import Reveal from '../Reveal.jsx'
import { PlayIcon } from '../Ornaments.jsx'
import { Petals } from '../Particles.jsx'

/*
 * Wedding film. States: idle (poster + play) → loading → playing | error.
 * The <video> element is only mounted after the guest presses play, so no video bytes are fetched up front,
 * and nothing ever plays by itself. With no video configured, a clearly labelled placeholder is shown.
 */
export default function VideoSection() {
  const [ref, seen] = useInView({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' })
  const [state, setState] = useState('idle')          // idle | loading | playing | error
  const vref = useRef(null)
  const music = useMusic()
  // never leave the background song held if this section unmounts mid-video
  useEffect(() => () => music && music.releaseVideo(), [music && music.releaseVideo]) // eslint-disable-line
  const src = asset(wedding.video), poster = asset(wedding.videoPoster)
  const [lead = 'Moments of', ...rest] = (wedding.videoTitle || 'Moments of Love').split(' ')
  const em = rest.pop() || '', mid = rest.join(' ')

  const play = () => {
    setState('loading')
    // video mounts on the next render; wait a tick for the ref, then start (this click is the user's gesture)
    requestAnimationFrame(() => { const v = vref.current; if (v) v.play().catch(() => { /* controls stay available */ }) })
  }
  const retry = () => { setState('idle') }

  return (
    <section ref={ref} className={'film sec sec--wide' + (seen ? ' seen' : '')} aria-labelledby="film-title">
      <Petals active={seen} />
      <SectionHeading id="film-title" eyebrow={wedding.videoLead || 'A glimpse of our celebration'} lead={lead + (mid ? ' ' + mid : '')} em={em} />

      <div className="film-frame">
        <div className={'film-screen is-' + state}>
          {!src && (
            <div className="film-empty" role="img" aria-label="Wedding video placeholder — no video added yet">
              <span className="film-empty-title">Placeholder — wedding video not added yet</span>
              <small>Put your file in <code>public/</code> and set <code>video</code> in <code>src/data/weddingDetails.js</code></small>
            </div>
          )}

          {src && state !== 'idle' && state !== 'error' && (
            <video
              ref={vref} src={src} poster={poster || undefined} controls playsInline preload="metadata"
              onWaiting={() => setState('loading')} onCanPlay={() => setState((s) => (s === 'loading' ? 'playing' : s))}
              onPlaying={() => setState('playing')} onError={() => { setState('error'); music && music.releaseVideo() }}
              onPlay={() => music && music.holdForVideo()} onPause={() => music && music.releaseVideo()} onEnded={() => music && music.releaseVideo()}
            />
          )}

          {src && (state === 'idle' || state === 'loading') && (
            <>
              {state === 'idle' && (poster ? <img className="film-poster" src={poster} alt="" loading="lazy" decoding="async" /> : <div className="film-backdrop" aria-hidden="true" />)}
              {state === 'idle' && (
                <button type="button" className="play" onClick={play} aria-label="Play wedding video"><span className="play-disc"><PlayIcon /></span><span className="play-label">Watch the film</span></button>
              )}
              {state === 'loading' && <div className="film-loading" role="status"><i className="spinner" aria-hidden="true" />Loading the film…</div>}
            </>
          )}

          {src && state === 'error' && (
            <div className="film-error" role="alert">
              <p>The video could not be loaded.</p>
              <small>Please check your connection and try again.</small>
              <button type="button" className="btn btn--ghost" onClick={retry}>Try again</button>
            </div>
          )}
        </div>
      </div>
      {src && <Reveal delay={200}><p className="film-note">Press play whenever you are ready — the film never starts by itself.</p></Reveal>}
    </section>
  )
}
