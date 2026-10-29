import { useEffect, useRef, useState } from 'react'
import { buildLink, buildMessage, clean } from '../utils.js'
import Reveal from './Reveal.jsx'
import SectionHeading from './SectionHeading.jsx'
import { ChatIcon, CheckIcon, Corners, CopyIcon, LinkIcon, Lotus, ShareIcon } from './Ornaments.jsx'

/* Only rendered on a normal visit. Personalised visits (?guest=…) never mount this component. */
export default function Share() {
  const [to, setTo] = useState(''); const [fam, setFam] = useState(''); const [greet, setGreet] = useState('')
  const [toast, setToast] = useState(null)               // { text, ok }
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const guest = clean(to), family = clean(fam)
  const link = buildLink(guest, family)
  const greeting = clean(greet) || `Namaste ${guest || 'Ji'}${family ? ' & ' + family : ''}`
  const msg = buildMessage(greeting, link)

  const say = (text, ok = true) => { setToast({ text, ok }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 3200) }
  const copy = async (text, label) => {
    try {
      if (!navigator.clipboard) throw new Error('no clipboard')
      await navigator.clipboard.writeText(text); say(`${label} copied to clipboard`)
    } catch { say('Copy was blocked by the browser — please select the text and copy it manually', false) }
  }
  const canShare = typeof navigator !== 'undefined' && !!navigator.share
  const nativeShare = async () => { try { await navigator.share({ text: msg }) } catch { /* cancelled by the user */ } }

  return (
    <section className="share-sec sec sec--wide" aria-labelledby="share-title">
      <SectionHeading id="share-title" eyebrow="For our family and friends" lead="Share the" em="Invitation" />
      <Reveal className="panel share">
        <Corners />
        <div className="share-grid">
          <div className="share-form">
            <p className="share-intro">Add a name and we will write a personal invitation — the link opens a page greeting them by name.</p>
            <label htmlFor="sh-to">Recipient name<input id="sh-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Rahul Ji" maxLength={60} autoComplete="off" /></label>
            <label htmlFor="sh-fam">Family name <small>(optional)</small><input id="sh-fam" value={fam} onChange={(e) => setFam(e.target.value)} placeholder="Family" maxLength={60} autoComplete="off" /></label>
            <label htmlFor="sh-greet">Greeting <small>(optional)</small><input id="sh-greet" value={greet} onChange={(e) => setGreet(e.target.value)} placeholder="Namaste Rahul Ji & Family" maxLength={80} autoComplete="off" /></label>
          </div>

          <figure className="note-card" aria-labelledby="note-label">
            <figcaption id="note-label" className="note-label"><Lotus size={18} />Message preview</figcaption>
            <blockquote className="note-text">{msg}</blockquote>
          </figure>
        </div>

        <div className="actions">
          <a className="btn btn--primary" href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer"><ChatIcon />Share on WhatsApp</a>
          <button type="button" className="btn btn--ghost" onClick={() => copy(link, 'Invitation link')}><LinkIcon />Copy Invitation Link</button>
          <button type="button" className="btn btn--ghost" onClick={() => copy(msg, 'Message')}><CopyIcon />Copy Message</button>
          {canShare && <button type="button" className="btn btn--ghost" onClick={nativeShare}><ShareIcon />More Ways to Share</button>}
        </div>
        <p className="helper">WhatsApp opens with this message ready. Choose the contact and press send yourself — nothing is sent automatically.</p>
        <div className="toast-slot" role="status" aria-live="polite">
          {toast && <p className={'toast' + (toast.ok ? '' : ' toast--warn')}>{toast.ok && <CheckIcon />}{toast.text}</p>}
        </div>
      </Reveal>
    </section>
  )
}
