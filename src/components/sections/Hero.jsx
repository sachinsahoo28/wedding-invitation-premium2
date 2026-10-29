import { wedding } from '../../data/weddingDetails.js'
import Photo from '../Photo.jsx'
import Reveal from '../Reveal.jsx'
import { Corners } from '../Ornaments.jsx'

export default function Hero({ guest }) {
  return (
    <section className="hero sec" aria-labelledby="couple-names">
      <div className="hero-corners" aria-hidden="true"><Corners /></div>
      <Reveal delay={450}><p className="eyebrow">Shubh Vivah</p></Reveal>
      <Reveal delay={600}><p className="greet">{guest.greeting},</p></Reveal>
      <Reveal delay={750}>
        <h1 className="names" id="couple-names">
          <span className="nm">{wedding.bride}</span>
          <span className="amp" aria-hidden="true"><i />&amp;<i /></span>
          <span className="sr-only"> and </span>
          <span className="nm">{wedding.groom}</span>
        </h1>
      </Reveal>
      <Reveal delay={900}><p className="lead">With the blessings of our elders, we invite you to share in the joy of our wedding.</p></Reveal>
      <Reveal delay={1000}>
        <div className="arch-frame hero-photo"><div className="arch-in"><Photo src={wedding.photos.hero} label="photos.hero" alt="The couple" eager /></div></div>
      </Reveal>
      <Reveal delay={150}><p className="tag">{wedding.hashtag}</p></Reveal>
    </section>
  )
}
