import React, { useCallback, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, MotionProvider, useMotion } from './lib/motion'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Header from './components/Header'
import MenuOverlay from './components/MenuOverlay'
import Home from './pages/Home'
import Work from './pages/Work'
import WorkDetail from './pages/WorkDetail'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function Shell() {
  const location = useLocation()
  const { motion } = useMotion()
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  /* Smooth scrolling synced with GSAP ScrollTrigger */
  useEffect(() => {
    if (!motion) return undefined
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      if (window.__lenis === lenis) window.__lenis = null
    }
  }, [motion])

  /* Recalculate trigger positions once webfonts are in */
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <MotionConfig reducedMotion={motion ? 'never' : 'always'}>
      <div className="min-h-screen bg-ink font-sans text-paper">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[700] -translate-y-24 rounded-full bg-ember px-4 py-2 text-sm font-medium text-ink focus:translate-y-0"
        >
          Skip to content
        </a>

        {loading ? <Preloader onDone={() => setLoading(false)} /> : null}
        <Cursor />
        <div className="grain" aria-hidden="true" />

        <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
        <MenuOverlay open={menuOpen} onClose={closeMenu} />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<WorkDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <Shell />
    </MotionProvider>
  )
}
