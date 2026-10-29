import { useEffect, useMemo, useRef } from 'react'
import { getGuest } from '../utils.js'
import Hero from './sections/Hero.jsx'
import Doors from './Doors.jsx'
import Couple from './sections/Couple.jsx'
import DateReveal from './sections/DateReveal.jsx'
import Events from './sections/Events.jsx'
import Venue from './sections/Venue.jsx'
import VideoSection from './sections/VideoSection.jsx'
import Closing from './sections/Closing.jsx'
import Share from './Share.jsx'
import Reveal from './Reveal.jsx'
import { Divider } from './Ornaments.jsx'

const Break = () => <Reveal className="sec-break"><Divider className="break" /></Reveal>

/* Page order = the "pages" of the invitation book. The royal doors sit well below the hero on purpose:
   guests find them by scrolling, and they only animate once their own section is reached. */
export default function Invitation({ ready }) {
  const guest = useMemo(() => getGuest(), [])      // parsed once per page load, safely
  const ref = useRef(null)
  useEffect(() => { if (ready && ref.current) ref.current.focus({ preventScroll: true }) }, [ready])
  return (
    <main className="invite" ref={ref} tabIndex={-1}>
      <Hero guest={guest} />
      <Doors />
      <Break />
      <Couple />
      <DateReveal />
      <Events />
      <Venue />
      <VideoSection />
      {/* Sharing tools are for the couple's circle only: personalised guests never get them */}
      {!guest.personalized && <Share />}
      <Closing />
    </main>
  )
}
