import { useEffect, useRef, useState } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Fires once when the element scrolls into view (IntersectionObserver).
 * Falls back to "already seen" when IntersectionObserver is missing or motion is reduced,
 * so content can never stay hidden.
 */
export function useInView({ threshold = 0, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined' || prefersReducedMotion())
  useEffect(() => {
    if (seen) return undefined
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver((entries) => {
      // also count elements already scrolled past (fast jumps / anchors), so nothing is left hidden
      if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top < 0)) { setSeen(true); io.disconnect() }
    }, { threshold, rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold, rootMargin])
  return [ref, seen]
}
