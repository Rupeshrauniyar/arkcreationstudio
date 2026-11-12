import React, { useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import Footer from './Footer'
import { ScrollTrigger } from '../lib/motion'

const ease = [0.76, 0, 0.24, 1]

/**
 * Page shell — handles the curtain transition, scroll reset,
 * document title and footer for every route.
 */
export default function Page({ title, label, children, footerCta = true }) {
  useLayoutEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    document.title = title ? `${title} — ARK Creation Studio` : 'ARK Creation Studio — Build. Move. Burn.'
  }, [title])

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <main id="main">{children}</main>
      <Footer cta={footerCta} />

      {/* Exit: ember wipe rises from the bottom */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[300] bg-ember"
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        exit={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.7, ease } }}
      />

      {/* Enter: ink panel with the page name wipes away upwards */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[301] grid place-items-center bg-ink"
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.9, ease, delay: 0.25 } }}
        exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        <motion.span
          className="flex items-center gap-4 font-display text-[clamp(2.5rem,8vw,7rem)] font-medium uppercase tracking-[-0.05em] text-paper"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -40, transition: { duration: 0.5, delay: 0.2, ease: 'easeIn' } }}
        >
          <span className="h-3 w-3 rounded-full bg-ember" />
          {label || title || 'Ark'}
        </motion.span>
      </motion.div>
    </>
  )
}

