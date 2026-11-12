import React, { Children, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, useMotion } from '../lib/motion'

/* ------------------------------------------------------------------
   Layout container — single source of horizontal alignment
------------------------------------------------------------------- */

export function Container({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`mx-auto w-full max-w-[1680px] px-5 md:px-10 ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------
   Small typographic helpers
------------------------------------------------------------------- */

export function Eyebrow({ index, children, className = '', tone = 'dark' }) {
  return (
    <div
      className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] ${
        tone === 'light' ? 'text-ink/55' : 'text-paper/50'
      } ${className}`}
    >
      {index ? <span className="text-ember">({index})</span> : null}
      <span className={`h-px w-8 ${tone === 'light' ? 'bg-ink/25' : 'bg-paper/25'}`} />
      <span>{children}</span>
    </div>
  )
}

export function RollText({ children, className = '' }) {
  return (
    <span className={`roll ${className}`}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

export function Serif({ children, className = '' }) {
  return <em className={`font-serif font-normal italic tracking-[-0.02em] ${className}`}>{children}</em>
}

/* ------------------------------------------------------------------
   Pill button / link with roll label + arrow swap
------------------------------------------------------------------- */

export function PillLink({ to, href, children, variant = 'solid', className = '', cursor, ...rest }) {
  const styles = {
    solid: 'bg-paper text-ink hover:bg-ember',
    ember: 'bg-ember text-ink hover:bg-paper',
    outline: 'border border-paper/25 text-paper hover:border-ember hover:bg-ember hover:text-ink',
    dark: 'bg-ink text-paper hover:bg-ember hover:text-ink',
  }
  const iconStyles = {
    solid: 'bg-ink text-paper',
    ember: 'bg-ink text-paper',
    outline: 'bg-paper text-ink',
    dark: 'bg-paper text-ink',
  }
  const cls = `group inline-flex items-center gap-4 rounded-full py-2 pl-6 pr-2 text-[13px] font-medium tracking-wide transition-colors duration-500 ${styles[variant]} ${className}`
  const inner = (
    <>
      <RollText>{children}</RollText>
      <span className={`arrow-swap h-10 w-10 rounded-full ${iconStyles[variant]}`}>
        <ArrowUpRight size={16} />
        <ArrowUpRight size={16} aria-hidden="true" />
      </span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls} data-cursor={cursor} {...rest}>
        {inner}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} data-cursor={cursor} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" className={cls} data-cursor={cursor} {...rest}>
      {inner}
    </button>
  )
}

/* ------------------------------------------------------------------
   Lines — masked line-by-line headline reveal
------------------------------------------------------------------- */

export function Lines({
  children,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  delay = 0,
  trigger = 'scroll',
  stagger = 0.08,
}) {
  const ref = useRef(null)
  const { motion } = useMotion()

  useLayoutEffect(() => {
    if (!motion || !ref.current) return undefined
    const ctx = gsap.context(() => {
      const vars = {
        yPercent: 118,
        rotate: 2.5,
        duration: 1.35,
        ease: 'expo.out',
        stagger,
        delay,
      }
      if (trigger === 'scroll') {
        vars.scrollTrigger = { trigger: ref.current, start: 'top 88%', once: true }
      }
      gsap.from(ref.current.querySelectorAll('[data-line]'), vars)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion])

  return (
    <Tag ref={ref} className={className}>
      {Children.map(children, (child, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] pr-[0.08em] -mb-[0.12em]">
          <span data-line className={`block origin-top-left will-change-transform ${lineClassName}`}>
            {child}
          </span>
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------
   Words — word-by-word masked reveal for paragraphs
------------------------------------------------------------------- */

export function Words({ text, as: Tag = 'p', className = '', delay = 0, trigger = 'scroll' }) {
  const ref = useRef(null)
  const { motion } = useMotion()

  useLayoutEffect(() => {
    if (!motion || !ref.current) return undefined
    const ctx = gsap.context(() => {
      const vars = { yPercent: 105, duration: 1, ease: 'expo.out', stagger: 0.012, delay }
      if (trigger === 'scroll') {
        vars.scrollTrigger = { trigger: ref.current, start: 'top 90%', once: true }
      }
      gsap.from(ref.current.querySelectorAll('[data-word]'), vars)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-flex overflow-hidden pb-[0.1em] -mb-[0.1em] align-top">
          <span data-word className="inline-block">
            {word}
            {'\u00A0'}
          </span>
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------
   Reveal — fade/slide up on scroll
------------------------------------------------------------------- */

export function Reveal({ children, className = '', delay = 0, y = 50, as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  const { motion } = useMotion()

  useLayoutEffect(() => {
    if (!motion || !ref.current) return undefined
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration: 1.2,
        delay,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
      })
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------
   Magnetic — element follows the pointer slightly
------------------------------------------------------------------- */

export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)
  const { motion } = useMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !motion || window.matchMedia('(pointer: coarse)').matches) return undefined

    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })

    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [motion, strength])

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------
   Counter — counts up when scrolled into view
------------------------------------------------------------------- */

export function Counter({ value, suffix = '', className = '' }) {
  const ref = useRef(null)
  const { motion } = useMotion()
  const [display, setDisplay] = useState(value)

  useLayoutEffect(() => {
    if (!motion || !ref.current) {
      setDisplay(value)
      return undefined
    }
    setDisplay(0)
    const obj = { v: 0 }
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: value,
          duration: 2,
          ease: 'expo.out',
          onUpdate: () => setDisplay(Math.round(obj.v)),
        }),
    })
    return () => {
      st.kill()
      gsap.killTweensOf(obj)
    }
  }, [motion, value])

  return (
    <span ref={ref} className={className}>
      {String(display).padStart(2, '0')}
      <span className="text-ember">{suffix}</span>
    </span>
  )
}

/* ------------------------------------------------------------------
   Marquee — infinite ticker that reacts to scroll velocity
------------------------------------------------------------------- */

export function Marquee({ items, className = '', itemClassName = '', duration = 30, reverse = false, separator }) {
  const track = useRef(null)
  const { motion } = useMotion()

  useLayoutEffect(() => {
    if (!motion || !track.current) return undefined
    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        track.current,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration, ease: 'none', repeat: -1 }
      )
      let direction = 1
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const v = self.getVelocity()
          direction = v < 0 ? -1 : 1
          const boost = 1 + Math.min(Math.abs(v) / 500, 4)
          gsap.to(tween, { timeScale: direction * boost, duration: 0.2, overwrite: true })
          gsap.to(tween, { timeScale: direction, duration: 1.2, delay: 0.2, overwrite: false })
        },
      })
    }, track)
    return () => ctx.revert()
  }, [motion, duration, reverse])

  const sep = separator ?? <span className="mx-[0.4em] text-ember">✺</span>
  const content = items.map((item, i) => (
    <span key={i} className={`inline-flex items-center ${itemClassName}`}>
      {item}
      {sep}
    </span>
  ))

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-label={items.join(', ')}>
      <div ref={track} className="inline-flex w-max will-change-transform" aria-hidden="true">
        <span className="inline-flex">{content}</span>
        <span className="inline-flex">{content}</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   Live clock for a timezone
------------------------------------------------------------------- */

export function useClock(timeZone, withSeconds = false) {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' } : {}),
    }).format(new Date())
  const [time, setTime] = useState(format)

  useEffect(() => {
    const id = setInterval(() => setTime(format()), withSeconds ? 1000 : 15000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone, withSeconds])

  return time
}

