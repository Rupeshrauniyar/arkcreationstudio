import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Instagram, Mail } from 'lucide-react'
import { navLinks, EMAIL, INSTAGRAM } from '../data/site'
import { lockScroll } from '../lib/motion'
import { MotionToggle } from './Header'

const ease = [0.76, 0, 0.24, 1]

export default function MenuOverlay({ open, onClose }) {
  const location = useLocation()

  useEffect(() => {
    if (!open) return undefined
    lockScroll(true)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-lenis-prevent
          className="fixed inset-0 z-[190] overflow-y-auto bg-ink-2 text-paper"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.8, ease, delay: 0.15 } }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle,rgb(255_91_31/0.22),transparent_60%)]" />

          <div className="relative flex min-h-full flex-col justify-between px-5 pb-8 pt-28 md:px-10">
            <nav className="group/menu flex flex-col" aria-label="Menu">
              {navLinks.map((l, i) => {
                const active = location.pathname === l.to
                return (
                  <div key={l.to} className="overflow-hidden border-b border-paper/10">
                    <motion.div
                      initial={{ y: '110%' }}
                      animate={{ y: '0%', transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.06 } }}
                      exit={{ y: '-110%', transition: { duration: 0.5, ease, delay: i * 0.03 } }}
                    >
                      <Link
                        to={l.to}
                        onClick={onClose}
                        className="group flex items-center justify-between py-3 transition-opacity duration-500 group-hover/menu:opacity-40 hover:!opacity-100"
                      >
                        <span className="flex items-baseline gap-4 md:gap-6">
                          <span className="font-sans text-[11px] tracking-[0.2em] text-ember">0{i + 1}</span>
                          <span className="font-display text-[clamp(2.75rem,10vw,7rem)] font-medium uppercase leading-[0.95] tracking-[-0.05em] transition-transform duration-700 ease-expo group-hover:translate-x-4">
                            {l.label}
                          </span>
                          {active ? <span className="h-2 w-2 rounded-full bg-ember" /> : null}
                        </span>
                        <ArrowUpRight className="h-8 w-8 -rotate-45 text-paper/40 transition-all duration-500 ease-expo group-hover:rotate-0 group-hover:text-ember md:h-12 md:w-12" strokeWidth={1.25} />
                      </Link>
                    </motion.div>
                  </div>
                )
              })}
            </nav>

            <motion.div
              className="mt-12 grid gap-8 text-sm text-paper/60 sm:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.8 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-paper/35">Get in touch</p>
                <a href={`mailto:${EMAIL}`} className="link-line inline-flex items-center gap-2 text-paper">
                  <Mail size={14} /> {EMAIL}
                </a>
              </div>
              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-paper/35">Follow</p>
                <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="link-line inline-flex items-center gap-2 text-paper">
                  <Instagram size={14} /> @arkcreationstudio
                </a>
              </div>
              <div className="flex flex-col items-start gap-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-paper/35">Preferences</p>
                <MotionToggle />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

