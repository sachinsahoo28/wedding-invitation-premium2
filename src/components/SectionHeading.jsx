import { Divider } from './Ornaments.jsx'
import Reveal from './Reveal.jsx'

/** Eyebrow (optional) + serif heading with one italic emphasised word + ornamental divider. */
export default function SectionHeading({ eyebrow, lead, em, tail, id, light = false }) {
  return (
    <Reveal as="header" className={'sh' + (light ? ' sh--light' : '')}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="h-section">{lead} {em && <em>{em}</em>}{tail ? ' ' + tail : ''}</h2>
      <Divider />
    </Reveal>
  )
}
