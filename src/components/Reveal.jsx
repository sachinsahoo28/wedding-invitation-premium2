import { useInView } from '../hooks.js'

/** Scroll-triggered entrance. Plays once; content is visible by default if IntersectionObserver is unavailable. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, seen] = useInView()
  return (
    <Tag ref={ref} className={`rv${seen ? ' in' : ''}${className ? ' ' + className : ''}`} style={{ '--d': delay + 'ms', ...style }} {...rest}>
      {children}
    </Tag>
  )
}
