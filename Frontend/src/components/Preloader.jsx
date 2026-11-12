import React, { useLayoutEffect, useRef, useState } from 'react'
import { gsap, markLoaded, useMotion, ScrollTrigger } from '../lib/motion'

const WORDS = ['Edit', 'Motion', 'AI', 'Web', 'Ark']

export default function Preloader({ onDone }) {
  const root = useRef(null)
  const { motion } = useMotion()
  const [count, setCount] = useState(0)

  useLayoutEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    const finish = () => {
      document.documentElement.style.overflow = ''
      markLoaded()
      onDone()
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    const ctx = gsap.context(() => {
      if (!motion) {
        setCount(100)
        gsap.to(root.current, { autoAlpha: 0, duration: 0.4, delay: 0.3, onComplete: finish })
        return
      }

      const obj = { v: 0 }
      const tl = gsap.timeline({ onComplete: finish })
      tl.to(obj, { v: 100, duration: 2, ease: 'power3.inOut', onUpdate: () => setCount(Math.round(obj.v)) }, 0)
        .fromTo('[data-pl-bar]', { scaleX: 0 }, { scaleX: 1, duration: 2, ease: 'power3.inOut' }, 0)
        .from('[data-pl-meta]', { opacity: 0, y: 12, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, 0.1)

      WORDS.forEach((_, i) => {
        if (i === 0) return
        tl.to('[data-pl-words]', { yPercent: -(100 / WORDS.length) * i, duration: 0.45, ease: 'expo.inOut' }, 0.15 + i * 0.4)
      })

      tl.to('[data-pl-inner]', { opacity: 0, y: -40, duration: 0.5, ease: 'power3.in' }, '+=0.05')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.2')
    }, root)

    return () => {
      ctx.revert()
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[600] bg-ink text-paper"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      role="status"
      aria-label="Loading ARK Creation Studio"
    >
      <div data-pl-inner className="flex h-full flex-col justify-between p-5 md:p-10">
        <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.22em] text-paper/50">
          <div data-pl-meta className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
            <span>ARK Creation Studio</span>
          </div>
          <span data-pl-meta className="hidden sm:block">Nepal — Worldwide</span>
          <span data-pl-meta>©{new Date().getFullYear()}</span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="h-[clamp(3rem,9vw,8rem)] overflow-hidden font-display text-[clamp(3rem,9vw,8rem)] font-medium uppercase leading-none tracking-[-0.05em]">
            <div data-pl-words>
              {WORDS.map((w, i) => (
                <div key={w} className="h-[clamp(3rem,9vw,8rem)]">
                  {i === WORDS.length - 1 ? (
                    <span>
                      Ark<span className="text-ember">.</span>
                    </span>
                  ) : (
                    <span className="font-serif normal-case italic text-ember">{w}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="font-display text-[clamp(4rem,16vw,15rem)] font-medium leading-[0.8] tracking-[-0.06em] tabular-nums">
            {String(count).padStart(3, '0')}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-paper/5">
          <div data-pl-bar className="h-full origin-left bg-ember" />
        </div>
      </div>
    </div>
  )
}

