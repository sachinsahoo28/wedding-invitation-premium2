import { wedding } from '../../data/weddingDetails.js'
import { splitWhen } from '../../utils.js'
import { useInView } from '../../hooks.js'
import Reveal from '../Reveal.jsx'
import SectionHeading from '../SectionHeading.jsx'
import { EventIcon } from '../Ornaments.jsx'

export default function Events() {
  const [ref, seen] = useInView({ rootMargin: '0px 0px -5% 0px' })
  return (
    <section className="events sec" aria-labelledby="events-title">
      <SectionHeading id="events-title" eyebrow="The festivities" lead="The" em="Celebrations" />
      <ol ref={ref} className={'timeline' + (seen ? ' drawn' : '')}>
        {wedding.events.map((e, i) => {
          const { when, at } = splitWhen(e.time)
          return (
            <Reveal as="li" key={e.name} delay={i % 2 ? 90 : 0} className="ev">
              <span className="ev-ico"><EventIcon name={e.name} /></span>
              <div className="ev-body">
                <h3 className="ev-name">{e.name}</h3>
                <p className="ev-when">{when && <b>{when}</b>}{at && <><i aria-hidden="true" /><b className="ev-at">{at}</b></>}</p>
                {e.place && <p className="ev-place">{e.place}</p>}
              </div>
            </Reveal>
          )
        })}
      </ol>
    </section>
  )
}
