import { useState } from 'react'
import { asset } from '../utils.js'

/**
 * Real photo when configured; otherwise (or if it fails to load) a clearly labelled placeholder.
 * Parent supplies the aspect ratio, so nothing shifts while the image loads.
 */
export default function Photo({ src, label, alt, eager = false, position = 'center 25%' }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className="ph" role="img" aria-label={`Placeholder: ${alt} (not yet added)`}>
        <span>Placeholder photo</span><small>{label}</small>
      </div>
    )
  }
  return <img src={asset(src)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: position }} onError={() => setFailed(true)} />
}
