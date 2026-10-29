import { wedding } from '../../data/weddingDetails.js'
import { prefersReducedMotion } from '../../hooks.js'
import Photo from '../Photo.jsx'
import Reveal from '../Reveal.jsx'
import { ArrowUpIcon, Divider } from '../Ornaments.jsx'

export default function Closing() {
  const top = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  return (
    <footer className="closing on-dark">
      <div className="closing-in">
        <Reveal><p className="closing-msg">{wedding.closing}</p></Reveal>
        <Reveal delay={120}><div className="medal"><div className="medal-in"><Photo src={wedding.photos.hero} label="photos.hero" alt="The couple" /></div></div></Reveal>
        <Reveal delay={200}>
          <p className="names names--sm">
            <span className="nm">{wedding.bride}</span><span className="amp" aria-hidden="true"><i />&amp;<i /></span><span className="sr-only"> and </span><span className="nm">{wedding.groom}</span>
          </p>
        </Reveal>
        <Reveal delay={260}><Divider /><p className="closing-tag">{wedding.hashtag}</p></Reveal>
        <Reveal delay={320}><button className="btn btn--ghost" onClick={top}><ArrowUpIcon />Return to Top</button></Reveal>
      </div>
    </footer>
  )
}
