import { wedding } from '../../data/weddingDetails.js'
import Photo from '../Photo.jsx'
import Reveal from '../Reveal.jsx'
import SectionHeading from '../SectionHeading.jsx'

export default function Couple() {
  return (
    <section className="couple sec" aria-labelledby="story-title">
      <div className="portraits">
        {['bride', 'groom'].map((k, i) => (
          <Reveal as="figure" key={k} delay={i * 140} className={'port ' + k}>
            <div className="arch-frame"><div className="arch-in"><Photo src={wedding.photos[k]} label={'photos.' + k} alt={wedding[k]} /></div></div>
            <figcaption><span className="pn">{wedding[k]}</span><em>{wedding.captions[k]}</em></figcaption>
          </Reveal>
        ))}
      </div>
      <SectionHeading id="story-title" eyebrow="How it began" lead="Our" em="Story" />
      <Reveal as="div" className="story"><p>{wedding.story}</p></Reveal>
    </section>
  )
}
