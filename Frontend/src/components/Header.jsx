import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { RollText, useClock } from './ui'
import { useMotion } from '../lib/motion'

const links = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'Studio' },
  { to: '/contact', label: 'Contact' },
]

export function MotionToggle({ className = '' }) {
  const { motion, setMotion } = useMotion()
  return (
    <button
      type="button"
      onClick={() => setMotion(!motion)}
      className={`group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/60 transition-colors hover:text-paper ${className}`}
      aria-label={motion ? 'Pause motion and animations' : 'Play motion and animations'}
    >
      <span className={`relative h-4 w-7 rounded-full border transition-colors ${motion ? 'border-ember bg-ember/20' : 'border-paper/30'}`}>
        <span
          className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all duration-500 ease-expo ${
            motion ? 'left-[14px] bg-ember' : 'left-[3px] bg-paper/50'
          }`}
        />
      </span>
      Motion
    </button>
  )
}

export default function Header({ menuOpen, onToggleMenu }) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const time = useClock('Asia/Kathmandu')

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 400)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setHidden(false), [location.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[200] px-2 pt-3 transition-transform duration-700 ease-expo md:px-6 md:pt-4 ${
        hidden && !menuOpen ? '-translate-y-[130%]' : 'translate-y-0'
      }`}
    >
      <div
        className={`mx-auto grid max-w-[1632px] grid-cols-[1fr_auto] items-center rounded-full border py-2 pl-3 pr-2 transition-[background-color,border-color,backdrop-filter] duration-500 md:pl-4 lg:grid-cols-[1fr_auto_1fr] ${
          scrolled && !menuOpen ? 'border-paper/10 bg-ink/60 backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
      >
        <Link to="/" className="group flex items-center gap-2.5 justify-self-start" aria-label="ARK Creation Studio — home">
          <img src="/logo.png" alt="" className="h-8 w-8 object-contain transition-transform duration-700 ease-expo group-hover:rotate-[20deg]" />
          <span className="font-display text-[15px] font-semibold tracking-[-0.02em]">
            ARK<sup className="ml-0.5 text-[9px] text-ember">®</sup>
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-paper/45 xl:inline">— Creation Studio</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  isActive ? 'text-paper' : 'text-paper/60 hover:text-paper'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <RollText>{l.label}</RollText>
                  <span
                    className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ember transition-all duration-500 ease-expo ${
                      isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-3 md:gap-4">
          <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/50 xl:flex">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" />
            KTM {time}
          </div>
          <MotionToggle className="hidden md:inline-flex" />
          <Link
            to="/contact"
            className="hidden rounded-full bg-paper px-5 py-2.5 text-[13px] font-medium text-ink transition-colors duration-500 hover:bg-ember sm:inline-flex"
          >
            <RollText>Start a project</RollText>
          </Link>
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="group flex h-11 items-center gap-3 rounded-full border border-paper/15 bg-ink/40 pl-4 pr-3 text-[13px] font-medium backdrop-blur-xl transition-colors hover:border-ember lg:hidden"
          >
            <RollText>{menuOpen ? 'Close' : 'Menu'}</RollText>
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ease-expo ${
                  menuOpen ? 'top-1/2 rotate-45' : 'top-0.5'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ease-expo ${
                  menuOpen ? 'top-1/2 -rotate-45' : 'bottom-0.5'
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

