import React, { useEffect, useRef, useState, Component } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Code2,
  Film,
  Instagram,
  Mail,
  Menu,
  MousePointer2,
  Play,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import { works } from './data/works'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

const ORANGE = '#ff6a00'

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function EmberField() {
  const ref = useRef(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * 0.022
    ref.current.rotation.y = state.clock.elapsedTime * 0.038
  })

  return (
    <Float speed={0.5} rotationIntensity={0.35} floatIntensity={0.55}>
      <Points ref={ref} limit={2400} range={3.8}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <PointMaterial transparent size={0.02} color={ORANGE} sizeAttenuation depthWrite={false} />
      </Points>
    </Float>
  )
}

function Scene() {
  return (
    <SceneErrorBoundary>
      <div className="pointer-events-none absolute inset-[-12%_-8%] z-0 hidden opacity-60 lg:block" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.45]}>
          <ambientLight intensity={1} />
          <EmberField />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { y: 44, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [delay])
  return <div ref={ref} className={className}>{children}</div>
}

function Loader() {
  const [done, setDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900)
    return () => clearTimeout(t)
  }, [])
  if (done) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#050505] text-white">
      <div className="flex w-[210px] flex-col items-center gap-5">
        <img src="/logo.png" alt="ARK" className="h-14 w-14 object-contain drop-shadow-[0_0_28px_rgba(255,86,0,.55)]" />
        <div className="h-px w-full overflow-hidden bg-white/10">
          <div className="h-full w-1/2 bg-gradient-to-r from-orange-600 via-orange-400 to-amber-300 animate-[loader_1s_cubic-bezier(.72,.05,.19,1)_forwards]" />
        </div>
        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/40">ARK CREATION STUDIO / 001</p>
      </div>
    </div>
  )
}

function Nav({ onMenu }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 px-5 py-4 transition-all duration-500 md:px-[4vw] md:py-5 ${scrolled ? 'bg-black/45 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-[1700px] items-center justify-between">
        <a href="#top" aria-label="ARK Creation Studio" className="group flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="h-8 w-8 object-contain transition-transform duration-500 group-hover:rotate-6" />
          <span className="hidden font-display text-[10px] font-bold leading-[1.03] tracking-[0.08em] text-white sm:block">ARK CREATION<br />STUDIO</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {['WORK', 'SERVICES', 'WHY ARK', 'CONTACT'].map((item) => (
            <a key={item} href={`#${item === 'WHY ARK' ? 'why' : item.toLowerCase()}`} className="text-[10px] font-semibold tracking-[0.16em] text-white/70 transition hover:-translate-y-px hover:text-white">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#contact" className="hidden items-center gap-2 rounded-full border border-white/25 px-3.5 py-2 text-[10px] font-semibold tracking-[0.15em] text-white transition hover:border-orange-400/80 hover:bg-orange-500/10 sm:flex">
            START A PROJECT <ArrowUpRight size={14} />
          </a>
          <button onClick={onMenu} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white md:hidden">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({ open, onClose }) {
  return (
    <div className={`fixed inset-0 z-[80] bg-[#070707] px-[7vw] transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <button className="absolute right-[6vw] top-5 grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white" onClick={onClose} aria-label="Close menu">
        <X size={22} />
      </button>
      <div className="flex h-full flex-col justify-center gap-3">
        {['work', 'services', 'why', 'contact'].map((id, i) => (
          <a key={id} onClick={onClose} href={`#${id}`} className="flex items-center gap-4 font-display text-[14vw] font-bold leading-none tracking-[-0.06em] text-white">
            <span className="font-sans text-[9px] tracking-[0.2em] text-white/30">0{i + 1}</span>{id.toUpperCase()}<ArrowUpRight size={20} className="text-orange-400" />
          </a>
        ))}
      </div>
    </div>
  )
}

function Magnetic({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * 0.12
      const y = (e.clientY - (r.top + r.height / 2)) * 0.12
      gsap.to(el, { x, y, duration: 0.35, overwrite: true, ease: 'power2.out' })
    }
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.45, overwrite: true, ease: 'elastic.out(1,.5)' })
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
      gsap.killTweensOf(el)
    }
  }, [])
  return <div ref={ref}>{children}</div>
}

function Hero() {
  const titleRef = useRef(null)
  useEffect(() => {
    const title = titleRef.current
    if (!title) return
    const ctx = gsap.context(() => {
      gsap.fromTo(title.querySelectorAll('[data-word]'), { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.08, delay: 0.55, ease: 'power4.out' })
      gsap.fromTo('[data-hero-kicker]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, delay: 0.45, duration: 0.7, ease: 'power3.out' })
      gsap.fromTo('[data-hero-copy]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, delay: 0.9, duration: 0.7, ease: 'power3.out' })
      gsap.fromTo('[data-hero-button]', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, delay: 1.05, duration: 0.75, ease: 'back.out(1.6)' })

      gsap.timeline({
        scrollTrigger: { trigger: title.closest('section'), start: 'top top', end: '+=90%', scrub: true }
      })
        .to(title, { scale: 0.72, y: -80, transformOrigin: '50% 25%', ease: 'none' }, 0)
        .to('[data-hero-kicker]', { opacity: 0, y: -20, ease: 'none' }, 0)
        .to('[data-hero-copy]', { opacity: 0, y: 30, ease: 'none' }, 0)
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pb-14 pt-32 md:px-[5vw] md:pt-36">
      <Scene />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] bg-[linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_74%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_40%,rgba(255,82,0,.18),transparent_30%),radial-gradient(circle_at_50%_35%,transparent_20%,#050505_76%)]" />
      <div className="relative z-10 mx-auto w-full max-w-[1700px]">
        <div data-hero-kicker className="mb-6 flex max-w-full flex-wrap items-center gap-2.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-white/55 md:text-[10px]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500 shadow-[0_0_18px_#ff6a00]" />
          INDEPENDENT CREATIVE + TECH STUDIO
          <span className="hidden border-l border-white/15 pl-3 text-white/35 sm:inline">NEPAL / WORLDWIDE</span>
        </div>

        <div ref={titleRef} className="max-w-[1220px] font-display text-[18vw] font-bold leading-[0.82] tracking-[-0.075em] sm:text-[15vw] md:text-[12vw] lg:text-[11.2vw]">
          <div className="overflow-hidden"><span data-word className="inline-block">MAKE</span></div>
          <div className="overflow-hidden">
            <span data-word className="inline-block bg-gradient-to-r from-[#ff3d00] via-[#ff8e00] to-[#ffd04e] bg-clip-text text-transparent">THE</span>{' '}
            <span data-word className="inline-block text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.55)]">SCROLL</span>
          </div>
          <div className="overflow-hidden"><span data-word className="inline-block">STOP<span className="text-orange-500">.</span></span></div>
        </div>

        <div className="mt-14 flex items-end justify-between gap-8 md:mt-20">
          <p data-hero-copy className="max-w-md text-[13px] leading-6 text-white/60 sm:text-[15px] sm:leading-7">
            We turn ideas into <span className="text-white">high-retention video, motion, AI creative and digital experiences</span> built to make people look twice.
          </p>
          <div data-hero-button className="hidden sm:block">
            <Magnetic>
              <a href="#work" className="group flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.025] text-[9px] font-semibold tracking-[0.16em] text-white backdrop-blur-xl transition duration-300 hover:border-orange-400/70 hover:bg-orange-500/10">
                VIEW<br />THE WORK
                <ArrowDownRight size={22} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/35 sm:absolute sm:bottom-8 sm:right-0 sm:mt-0">
          <span>Scroll to explore</span><span className="h-px w-16 bg-white/30" />
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const text = 'VIDEO EDITING  /  MOTION GRAPHICS  /  AI UGC ADS  /  WEB EXPERIENCES  /  CREATIVE TECHNOLOGY  /  '
  return (
    <div className="overflow-hidden border-y border-white/[0.08] bg-black whitespace-nowrap">
      <div className="inline-flex min-w-max animate-[marquee_22s_linear_infinite] py-4 font-display text-[22px] tracking-[-0.03em] text-white/50 md:text-[34px]">
        {Array.from({ length: 4 }).map((_, i) => <span key={i} className="pr-10">{text}</span>)}
      </div>
    </div>
  )
}

function SectionHeader({ index, eyebrow, title, children }) {
  return (
    <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35"><span className="mr-2 text-orange-500">+</span>{index} / {eyebrow}</span>
        <h2 className="mt-5 font-display text-[14vw] font-bold leading-[0.86] tracking-[-0.065em] text-white md:text-[7.3vw] lg:text-[7vw]">{title}</h2>
      </div>
      <div className="max-w-md text-[13px] leading-6 text-white/50 md:text-[14px] md:leading-7">{children}</div>
    </div>
  )
}

function WorkThumb({ work }) {
  const [src, setSrc] = useState(work.poster || work.thumbnail || '')
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_42%,rgba(255,94,0,.16),transparent_36%),#090909]">
        <Play size={28} fill="currentColor" className="text-orange-400" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`${work.title} preview`}
      referrerPolicy="no-referrer"
      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
      onError={() => {
        if (work.thumbnailFallback && src !== work.thumbnailFallback) setSrc(work.thumbnailFallback)
        else setFailed(true)
      }}
    />
  )
}

function WorkPlayer({ work, onClose }) {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.__lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md md:p-10" onClick={onClose}>
      <button type="button" onClick={onClose} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/50 text-white transition hover:border-orange-400/70 hover:bg-orange-500/10" aria-label="Close player">
        <X size={18} />
      </button>
      <div className="relative aspect-video w-full max-w-5xl overflow-hidden border border-white/15 bg-black shadow-[0_0_80px_rgba(255,86,0,.18)]" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        {work.type === 'drive' ? (
          <iframe
            key={work.fileId || work.embed}
            title={work.title}
            src={`${work.embed}${work.embed.includes('?') ? '&' : '?'}autoplay=1`}
            className="h-full w-full border-0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={work.src} poster={work.poster} controls autoPlay playsInline className="h-full w-full object-contain" />
        )}
      </div>
    </div>
  )
}

function WorkCard({ work, index, active, setActive, onPlay }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: 65, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  const isPlaceholder = work.type === 'drive' && String(work.embed || '').includes('YOUR_GOOGLE_DRIVE')

  return (
    <article ref={ref} className="group">
      <div className="relative aspect-[16/10] cursor-pointer overflow-hidden border border-white/10 bg-[#0a0a0a]" onClick={() => { if (!isPlaceholder) onPlay(work) }}>
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(255,95,0,.14),transparent_45%)] opacity-80 transition duration-700 group-hover:opacity-100" />
        {isPlaceholder ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_42%,rgba(255,94,0,.14),transparent_34%),#090909] text-center">
            <span className="font-display text-[12px] font-semibold tracking-[0.2em] text-orange-400">YOUR WORK GOES HERE</span>
            <span className="max-w-xs px-6 text-[10px] uppercase tracking-[0.14em] text-white/30">Add a Google Drive file ID / URL in src/data/works.js and it will appear automatically.</span>
          </div>
        ) : (
          <WorkThumb work={work} />
        )}

        <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between">
          <div className="bg-black/45 px-2.5 py-2 text-[9px] tracking-[0.16em] text-white/70 backdrop-blur-xl">{work.number}</div>
          {!isPlaceholder && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onPlay(work) }} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-xl transition hover:border-orange-400/70 hover:bg-orange-500/10" aria-label={`Play ${work.title}`}>
              <Play size={15} fill="currentColor" />
            </button>
          )}
        </div>
      </div>

      <button type="button" onClick={() => setActive(active === index ? null : index)} className="flex w-full items-start justify-between gap-4 border-b border-white/10 py-4 text-left">
        <div>
          <div className="text-[9px] font-semibold tracking-[0.17em] text-orange-400">{work.category}</div>
          <h3 className="mt-1.5 font-display text-xl tracking-[-0.03em] text-white md:text-2xl">{work.title}</h3>
        </div>
        <ArrowUpRight size={19} className="mt-1 text-white/40 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-orange-400" />
      </button>

      <div className={`overflow-hidden transition-all duration-500 ${active === index ? 'max-h-28 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="max-w-xl pt-3 text-[12px] leading-5 text-white/45">{work.description}</p>
      </div>
    </article>
  )
}

function Work() {
  const [active, setActive] = useState(null)
  const [playing, setPlaying] = useState(null)
  return (
    <section id="work" className="bg-[#050505] px-6 py-24 md:px-[5vw] md:py-32">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeader index="02" eyebrow="SELECTED OUTPUT" title={<><span>WORK THAT</span><br /><span className="bg-gradient-to-r from-[#ff3d00] via-[#ff8e00] to-[#ffd04e] bg-clip-text text-transparent">MOVES.</span></>}>
          <p>Here is where your strongest projects become the proof. Add Google Drive links to the portfolio array and ARK automatically turns them into a visual case-study wall.</p>
        </SectionHeader>
        <div className="grid gap-12 md:grid-cols-2 md:gap-x-6 md:gap-y-20">
          {works.map((work, i) => <WorkCard key={work.id} work={work} index={i} active={active} setActive={setActive} onPlay={setPlaying} />)}
        </div>
      </div>
      {playing ? <WorkPlayer work={playing} onClose={() => setPlaying(null)} /> : null}
    </section>
  )
}

const services = [
  { n: '01', icon: Film, title: 'VIDEO EDITING', copy: 'Short-form, long-form, ads, launch films and social cuts shaped around retention, rhythm and brand intent.' },
  { n: '02', icon: Sparkles, title: 'MOTION GRAPHICS', copy: 'Kinetic typography, product motion, transitions and visual systems that make a brand feel alive.' },
  { n: '03', icon: Zap, title: 'AI UGC ADS', copy: 'Fast, scalable creative with scripts, hooks, avatars, product demos and multiple variations built for testing.' },
  { n: '04', icon: Code2, title: 'WEB + DIGITAL', copy: 'High-impact websites and landing pages combining sharp UX, motion, responsive front ends and 3D.' },
]

function Services() {
  const [open, setOpen] = useState(null)
  return (
    <section id="services" className="border-t border-white/[0.08] bg-[#050505] px-6 py-24 md:px-[5vw] md:py-32">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeader index="03" eyebrow="WHAT WE BUILD" title={<><span>ONE STUDIO.</span><br /><span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.55)]">FOUR</span> ENGINES.</>}>
          <p>One creative partner from concept to delivery. We keep video, motion, AI and web under one roof so ideas move faster and stay consistent.</p>
        </SectionHeader>

        <div className="border-t border-white/10">
          {services.map((service, i) => {
            const Icon = service.icon
            const isOpen = open === i
            return (
              <button key={service.n} onClick={() => setOpen(isOpen ? null : i)} className={`grid w-full grid-cols-[36px_34px_1fr_22px] items-center gap-3 border-b border-white/10 py-6 text-left transition-all duration-500 md:grid-cols-[58px_54px_minmax(250px,1fr)_minmax(280px,380px)_24px] md:gap-4 md:py-7 ${isOpen ? 'bg-gradient-to-r from-white/[0.035] to-transparent px-3' : 'hover:bg-white/[0.018]'}`}>
                <span className="text-[10px] tracking-[0.15em] text-white/25">{service.n}</span>
                <Icon size={25} strokeWidth={1.5} className="text-orange-400" />
                <span className="font-display text-[25px] tracking-[-0.04em] text-white md:text-[3vw] lg:text-[46px]">{service.title}</span>
                <span className={`col-span-2 mt-2 text-[12px] leading-5 text-white/45 md:col-span-1 md:mt-0 md:block ${isOpen ? 'block' : 'hidden'}`}>{service.copy}</span>
                <ArrowUpRight className={`transition duration-300 ${isOpen ? 'rotate-45 text-orange-400' : 'text-white/55'}`} size={21} />
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Why() {
  const points = [
    ['FAST', 'Tight turnaround without cutting corners. We work around the campaign clock.'],
    ['FLEX', 'Revisions are part of the process. We refine until the final version feels right.'],
    ['SMART', 'Lean pricing means more of your budget goes into the actual creative.'],
    ['SHARP', 'Premium craft across editing, motion, AI creative and digital execution.'],
  ]

  return (
    <section id="why" className="border-t border-white/[0.08] bg-[#050505] px-6 py-24 md:px-[5vw] md:py-32">
      <div className="mx-auto max-w-[1700px]">
        <Reveal>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35"><span className="mr-2 text-orange-500">+</span>04 / WHY ARK</span>
          <div className="mt-8 font-display text-[17vw] font-bold leading-[0.82] tracking-[-0.075em] text-white md:text-[10.3vw]">
            BIG-STUDIO<br /><span className="bg-gradient-to-r from-[#ff3d00] via-[#ff8e00] to-[#ffd04e] bg-clip-text text-transparent">ENERGY.</span><br />LEAN-STUDIO<br /><span className="text-white/90">PRICING.</span>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(([title, copy], i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="flex min-h-[205px] flex-col justify-between bg-[#050505] p-5 md:min-h-[230px] md:p-6">
                <span className="text-[10px] tracking-[0.15em] text-white/25">0{i + 1}</span>
                <div>
                  <strong className="font-display text-4xl tracking-[-0.04em] text-white">{title}</strong>
                  <p className="mt-3 max-w-[250px] text-[12px] leading-5 text-white/40">{copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function International() {
  return (
    <section className="px-6 py-12 md:px-[5vw] md:py-20">
      <div className="relative mx-auto min-h-[600px] max-w-[1700px] overflow-hidden border border-white/10 bg-[#070707] p-8 md:p-[7vw]">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,70,0,.08),transparent_36%),radial-gradient(circle_at_79%_42%,rgba(255,145,0,.11),transparent_29%)]" />
        <div className="absolute -right-[8%] top-1/2 h-[78vw] max-h-[650px] w-[78vw] max-w-[650px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_40%_38%,#ffca5b_0%,#ff6a00_12%,#ef2500_27%,#140600_47%,transparent_67%)] blur-2xl opacity-60 animate-[orb_9s_ease-in-out_infinite_alternate]" />
        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35"><span className="mr-2 text-orange-500">+</span>05 / GLOBAL BY DEFAULT</span>
          <h2 className="mt-6 font-display text-[14vw] font-bold leading-[0.84] tracking-[-0.065em] text-white md:text-[8vw] lg:text-[7vw]">LOCAL ROOTS.<br /><span className="bg-gradient-to-r from-[#ff3d00] via-[#ff8e00] to-[#ffd04e] bg-clip-text text-transparent">GLOBAL OUTPUT.</span></h2>
          <p className="mt-8 max-w-2xl text-[13px] leading-6 text-white/45 md:text-[15px] md:leading-7">ARK is built in Nepal and works beyond borders. We collaborate asynchronously with brands, creators and teams that need fast, premium creative without the overhead of a traditional agency.</p>
          <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {['NEPAL', 'REMOTE', 'WORLDWIDE', '24/7 CREATIVE'].map((x) => <span key={x} className="border border-white/10 px-3 py-2 text-center text-[9px] font-semibold tracking-[0.16em] text-white/40">{x}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function Process() {
  const steps = [
    ['01', 'BRIEF', 'You tell us what needs to move.'],
    ['02', 'BUILD', 'We cut, animate, generate and design.'],
    ['03', 'REFINE', 'Fast feedback rounds, focused revisions.'],
    ['04', 'SHIP', 'Final files ready for launch, ads or social.'],
  ]
  return (
    <section className="border-t border-white/[0.08] bg-[#050505] px-6 py-24 md:px-[5vw] md:py-28">
      <div className="mx-auto max-w-[1700px]">
        <Reveal>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35"><span className="mr-2 text-orange-500">+</span>06 / THE FLOW</span>
              <h2 className="mt-5 font-display text-[12vw] font-bold leading-[0.86] tracking-[-0.065em] text-white md:text-[7vw]">FROM IDEA<br /><span className="text-white/35">TO IMPACT.</span></h2>
            </div>
            <p className="max-w-sm text-[13px] leading-6 text-white/40">Simple process. Clear communication. No mystery around timelines, revisions or deliverables.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([n, title, copy]) => (
            <div key={n} className="group min-h-[190px] bg-[#050505] p-6 transition hover:bg-white/[0.025] md:min-h-[220px]">
              <div className="flex items-center justify-between text-[9px] tracking-[0.17em] text-white/25"><span>{n}</span><MousePointer2 size={15} className="text-orange-400 transition group-hover:rotate-12" /></div>
              <div className="mt-20"><div className="font-display text-3xl tracking-[-0.04em] text-white">{title}</div><p className="mt-2 text-[12px] leading-5 text-white/40">{copy}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer id="contact" className="border-t border-white/[0.08] bg-[#050505] px-6 pb-6 pt-24 md:px-[5vw] md:pt-36">
      <div className="mx-auto max-w-[1700px]">
        <div className="flex flex-col justify-between gap-14 pb-20 md:flex-row">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35"><span className="mr-2 text-orange-500">+</span>07 / START SOMETHING</span>
            <h2 className="mt-6 font-display text-[17vw] font-bold leading-[0.82] tracking-[-0.075em] text-white md:text-[10.5vw]">HAVE A<br /><span className="bg-gradient-to-r from-[#ff3d00] via-[#ff8e00] to-[#ffd04e] bg-clip-text text-transparent">BIG IDEA?</span></h2>
          </div>
          <div className="w-full max-w-xl pt-8 md:pt-16">
            <a href="mailto:arkcreationstudio@gmail.com" className="group flex items-center justify-between gap-4 border-b border-white/15 py-5 font-display text-[18px] tracking-[-0.03em] text-white md:text-[28px]">
              <span>arkcreationstudio@gmail.com</span><ArrowUpRight size={22} className="text-white/40 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-orange-400" />
            </a>
            <a href="https://www.instagram.com/arkcreationstudio/" target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 border-b border-white/15 py-5 text-[12px] text-white/50">
              <span className="flex items-center gap-3"><Instagram size={18} /> Instagram / @arkcreationstudio</span><ArrowUpRight size={19} className="transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-orange-400" />
            </a>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['Fast turnaround', 'Flexible revisions', 'Lean pricing', 'Premium quality'].map((x) => <div key={x} className="border border-white/10 px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/35"><Check size={13} className="mb-3 text-orange-400" />{x}</div>)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-white/10 pt-4 text-[9px] tracking-[0.14em] text-white/25">
          <span>© {new Date().getFullYear()} ARK CREATION STUDIO</span>
          <span>BUILD. MOVE. BURN.</span>
          <span>NEPAL / WORLDWIDE</span>
        </div>
      </div>
    </footer>
  )
}

function App() {
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const glow = document.createElement('div')
    glow.className = 'pointer-events-none fixed left-0 top-0 z-[5] hidden h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,89,0,.08),transparent_66%)] lg:block'
    document.body.appendChild(glow)
    const move = (e) => gsap.to(glow, { left: e.clientX, top: e.clientY, duration: 0.35, overwrite: true, ease: 'power2.out' })
    window.addEventListener('pointermove', move, { passive: true })

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    window.__lenis = lenis
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      if (window.__lenis === lenis) window.__lenis = null
      lenis.destroy()
      window.removeEventListener('pointermove', move)
      glow.remove()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-orange-500 selection:text-black">
      <Loader />
      <Nav onMenu={() => setMenu(true)} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Services />
        <Why />
        <International />
        <Process />
      </main>
      <Contact />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
