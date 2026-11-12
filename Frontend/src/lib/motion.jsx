import React, { createContext, useContext, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------
   Motion preference — respects prefers-reduced-motion by default and
   can be toggled by the user (also acts as the pause control for
   marquees, autoplaying video and smooth scrolling).
------------------------------------------------------------------- */

const readInitialMotion = () => {
  if (typeof window === 'undefined') return true
  const saved = localStorage.getItem('ark-motion')
  const value = saved
    ? saved === 'on'
    : !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.documentElement.dataset.motion = value ? 'on' : 'off'
  return value
}

const MotionCtx = createContext({ motion: true, setMotion: () => {} })

export function MotionProvider({ children }) {
  const [motion, setMotionState] = useState(readInitialMotion)

  const setMotion = (value) => {
    document.documentElement.dataset.motion = value ? 'on' : 'off'
    localStorage.setItem('ark-motion', value ? 'on' : 'off')
    setMotionState(value)
  }

  return <MotionCtx.Provider value={{ motion, setMotion }}>{children}</MotionCtx.Provider>
}

export const useMotion = () => useContext(MotionCtx)

/* ------------------------------------------------------------------
   Intro timing — first page waits for the preloader, later pages wait
   for the curtain transition.
------------------------------------------------------------------- */

let firstLoad = true
export const markLoaded = () => {
  firstLoad = false
}
export const introDelay = () => (firstLoad ? 2.65 : 0.8)

/* ------------------------------------------------------------------
   useGsap — scoped gsap.context that only runs when motion is on and
   reverts cleanly (restoring final, visible state) when it turns off.
------------------------------------------------------------------- */

export function useGsap(callback, deps = []) {
  const scope = useRef(null)
  const { motion } = useMotion()

  useLayoutEffect(() => {
    if (!motion || !scope.current) return undefined
    const ctx = gsap.context(callback, scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion, ...deps])

  return scope
}

/* ------------------------------------------------------------------
   Scroll helpers (Lenis aware)
------------------------------------------------------------------- */

export const scrollToTarget = (target, offset = 0) => {
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset })
}

export const lockScroll = (locked) => {
  if (locked) {
    window.__lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
  } else {
    window.__lenis?.start()
    document.documentElement.style.overflow = ''
  }
}

export { gsap, ScrollTrigger }

