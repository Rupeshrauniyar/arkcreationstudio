import React, { useEffect, useRef, useState } from 'react'
import { gsap, useMotion } from '../lib/motion'

const INTERACTIVE = 'a, button, [role="button"], label, select, summary, [data-cursor]'

export default function Cursor() {
  const { motion } = useMotion()
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [hover, setHover] = useState(false)
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(fine && motion)
  }, [motion])

  useEffect(() => {
    if (!enabled) return undefined
    const root = document.documentElement
    root.classList.add('has-cursor')

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })

    let visible = false
    const move = (e) => {
      if (!visible) {
        visible = true
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e) => {
      const target = e.target.closest?.(INTERACTIVE)
      const labelled = e.target.closest?.('[data-cursor]')
      setLabel(labelled?.dataset.cursor || '')
      setHover(Boolean(target))
    }
    const leave = () => {
      visible = false
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 })
    }
    const down = () => gsap.to(ring.current, { scale: 0.82, duration: 0.2 })
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.5)' })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    root.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)

    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      root.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled])

  if (!enabled) return null

  const ringSize = label ? 'h-24 w-24 border-transparent bg-ember' : hover ? 'h-16 w-16 border-paper/50 bg-paper/5' : 'h-9 w-9 border-paper/35'

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none invisible fixed left-0 top-0 z-[500] -translate-x-1/2 -translate-y-1/2 opacity-0"
        aria-hidden="true"
      >
        <div
          className={`grid place-items-center rounded-full border backdrop-blur-[2px] transition-[width,height,background-color,border-color] duration-500 ease-expo ${ringSize}`}
        >
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition-opacity duration-300 ${
              label ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {label}
          </span>
        </div>
      </div>
      <div
        ref={dot}
        className={`pointer-events-none invisible fixed left-0 top-0 z-[501] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember opacity-0 transition-[scale] duration-300 ${
          label ? 'scale-0' : ''
        }`}
        aria-hidden="true"
      />
    </>
  )
}

