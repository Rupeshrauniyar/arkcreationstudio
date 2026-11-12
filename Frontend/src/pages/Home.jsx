import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import Page from '../components/Page'
import Scene from '../components/Scene'
import WorkMedia from '../components/WorkMedia'
import VideoModal from '../components/VideoModal'
import { Container, Counter, Eyebrow, Lines, Marquee, PillLink, Reveal, Serif, Words } from '../components/ui'
import { gsap, introDelay, useGsap, useMotion } from '../lib/motion'
import { works } from '../data/works'
import { process, services, stats, values } from '../data/site'

const SLIDE_MS = 5000

/* ------------------------------------------------------------------
   Featured reel — auto-advancing project showcase in the hero
------------------------------------------------------------------- */

function FeaturedReel({ onPlay }) {
  const { motion: motionOn } = useMotion()
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState(null)
  const [paused, setPaused] = useState(false)
  const work = works[index]

  const go = useCallback(
    (next) => {
      setPrev(index)
      setIndex((next + works.length) % works.length)
    },
    [index]
  )

  return (
    <div className="relative" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-paper/10 bg-ink-3 sm:aspect-[5/4] lg:aspect-auto lg:h-[min(58svh,560px)]">
        {works.map((w, i) => {
          const state = i === index ? 'active' : i === prev ? 'prev' : 'idle'
          return (
            <div
              key={w.id}
              className={`absolute inset-0 transition-[clip-path] duration-1000 ease-quart ${
                state === 'active' ? 'z-20 [clip-path:inset(0_0_0_0)]' : state === 'prev' ? 'z-10 [clip-path:inset(0_0_0_0)]' : 'z-0 [clip-path:inset(100%_0_0_0)]'
              }`}
              aria-hidden={state !== 'active'}
            >
              <WorkMedia work={w} className="h-full w-full" preview={false} showMeta={false} eager={i === 0} />
            </div>
          )
        })}

        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/40" />

        <div className="absolute inset-x-0 top-0 z-40 flex items-center justify-between p-5 text-[11px] uppercase tracking-[0.2em] text-paper/70 md:p-6">
          <span className="flex items-center gap-2">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" /> Featured work
          </span>
          <span className="tabular-nums">
            {work.number} / {String(works.length).padStart(2, '0')}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-40 p-5 md:p-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-ember">{work.category}</p>
              <h3 className="mt-2 font-display text-[clamp(1.5rem,2.2vw,2.25rem)] font-medium uppercase leading-[0.95] tracking-[-0.035em]">
                {work.title}
              </h3>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              data-cursor="Play"
              onClick={() => onPlay(work)}
              className="group inline-flex items-center gap-3 rounded-full bg-paper py-2 pl-2 pr-5 text-[13px] font-medium text-ink transition-colors duration-500 hover:bg-ember"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper">
                <Play size={13} fill="currentColor" className="translate-x-px" />
              </span>
              Play film
            </button>
            <Link
              to={`/work/${work.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-5 py-3 text-[13px] font-medium transition-colors hover:border-ember hover:text-ember"
            >
              Case study <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${works.length}, minmax(0, 1fr))` }}>
          {works.map((w, i) => (
            <button
              key={w.id}
              type="button"
              onClick={() => go(i)}
              className="group py-2"
              aria-label={`Show ${w.title}`}
              aria-current={i === index ? 'true' : undefined}
            >
              <span className="block h-[2px] overflow-hidden rounded-full bg-paper/15 transition-colors group-hover:bg-paper/30">
                {i === index ? (
                  <span
                    key={index}
                    className={`block h-full origin-left bg-ember ${motionOn ? 'reel-progress' : ''}`}
                    style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                    onAnimationEnd={() => go(index + 1)}
                  />
                ) : i < index ? (
                  <span className="block h-full bg-paper/50" />
                ) : null}
              </span>
            </button>
          ))}
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-full border border-paper/15 text-paper/50" aria-hidden="true">
          {paused || !motionOn ? <Pause size={12} /> : <Play size={11} fill="currentColor" />}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   Hero
------------------------------------------------------------------- */

function Hero({ onPlay }) {
  const delay = introDelay()

  const scope = useGsap(() => {
    gsap.from('[data-hero-fade]', { opacity: 0, y: 24, duration: 1.2, stagger: 0.07, ease: 'expo.out', delay: delay + 0.45 })
    gsap.from('[data-hero-card]', { opacity: 0, y: 80, scale: 0.94, duration: 1.6, ease: 'expo.out', delay: delay + 0.15 })
    gsap.from('[data-hero-scene]', { opacity: 0, duration: 2.4, ease: 'power2.out', delay: delay - 0.3 })
    gsap.to('[data-hero-scene]', {
      yPercent: 25,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
    })
  })

  return (
    <section ref={scope} data-hero className="relative overflow-hidden pb-10 pt-24 md:pt-28 lg:flex lg:min-h-[100svh] lg:flex-col">
      <div data-hero-scene className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[65%]">
        <Scene className="absolute inset-0 opacity-70" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_45%,transparent,var(--color-ink)_80%)]" />

      <Container className="relative z-10 flex flex-1 flex-col">
        <div className="grid grid-cols-2 gap-4 border-b border-paper/10 pb-5 text-[11px] uppercase tracking-[0.2em] text-paper/50 md:grid-cols-3">
          <span data-hero-fade>
            <span className="text-ember">(001)</span> Creative + tech studio
          </span>
          <span data-hero-fade className="hidden text-center md:block">
            Video · Motion · AI · Web
          </span>
          <span data-hero-fade className="text-right">
            Nepal — Worldwide
          </span>
        </div>

        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-12 lg:gap-10 lg:py-10">
          <div className="lg:col-span-7">
            <Lines
              as="h1"
              trigger="load"
              delay={delay}
              stagger={0.1}
              className="font-display text-[clamp(3.4rem,7.4vw,8.75rem)] font-medium uppercase leading-[0.86] tracking-[-0.06em]"
            >
              <span>We make</span>
              <span>
                the <Serif className="normal-case text-ember">scroll</Serif>
              </span>
              <span>
                stop<span className="text-ember">.</span>
              </span>
            </Lines>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:items-end lg:mt-12">
              <p data-hero-fade className="max-w-sm text-[15px] leading-relaxed text-paper/60">
                We turn ideas into <span className="text-paper">high-retention video, motion, AI creative and digital experiences</span> built to make people look twice.
              </p>
              <div data-hero-fade className="flex flex-wrap gap-3 sm:justify-end lg:justify-start">
                <PillLink to="/contact" variant="ember">
                  Start a project
                </PillLink>
                <PillLink to="/work" variant="outline">
                  See the work
                </PillLink>
              </div>
            </div>
          </div>

          <div data-hero-card className="lg:col-span-5 lg:pl-6">
            <FeaturedReel onPlay={onPlay} />
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-paper/10 lg:grid-cols-4">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              to={`/services#${s.slug}`}
              data-hero-fade
              className={`group flex items-center justify-between gap-3 py-5 pr-4 transition-colors hover:text-ember ${
                i % 2 === 1 ? 'pl-4 border-l border-paper/10' : ''
              } ${i > 1 ? 'border-t border-paper/10 lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l lg:pl-4' : ''}`}
            >
              <span className="flex items-baseline gap-3">
                <span className="text-[11px] tracking-[0.2em] text-ember">{s.n}</span>
                <span className="text-sm font-medium md:text-[15px]">{s.title}</span>
              </span>
              <ArrowRight size={15} className="-translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------
   Studio intro — light section
------------------------------------------------------------------- */

const STATEMENT =
  'ARK is an independent *creative* + tech studio from Nepal. We fuse editing, motion, AI and code into work that *earns* attention — and keeps it.'

function StudioIntro() {
  const scope = useGsap(() => {
    gsap.fromTo(
      '[data-sword]',
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 50%', scrub: true },
      }
    )
  })

  return (
    <section ref={scope} className="relative z-10 rounded-t-[2rem] bg-paper py-24 text-ink md:rounded-t-[3rem] md:py-36">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Eyebrow index="002" tone="light">
              The studio
            </Eyebrow>
          </div>
          <div className="lg:col-span-9">
            <p data-statement className="font-display text-[clamp(2rem,4.2vw,4.25rem)] font-medium leading-[1.06] tracking-[-0.04em]">
              {STATEMENT.split(' ').map((word, i) => {
                const accent = word.startsWith('*')
                const clean = word.replace(/\*/g, '')
                return (
                  <span key={i} data-sword className="inline-block">
                    {accent ? <Serif className="text-ember">{clean}</Serif> : clean}
                    {'\u00A0'}
                  </span>
                )
              })}
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <PillLink to="/about" variant="dark">
              About the studio
            </PillLink>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col gap-10 bg-paper p-6">
                  <span className="text-[11px] tracking-[0.2em] text-ink/40">{v.n}</span>
                  <div>
                    <h3 className="font-display text-3xl font-medium uppercase tracking-[-0.04em]">
                      {v.title}
                      <span className="text-ember">.</span>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/60">{v.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------
   Selected work — editorial grid
------------------------------------------------------------------- */

const LAYOUT = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7']

function SelectedWork() {
  const scope = useGsap(() => {
    gsap.utils.toArray('[data-work-card]').forEach((card) => {
      const inner = card.querySelector('[data-parallax-inner]')
      if (!inner) return
      gsap.fromTo(inner, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
  })

  return (
    <section ref={scope} className="py-24 md:py-36">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow index="003">Selected work</Eyebrow>
            <Lines className="mt-6 font-display text-[clamp(2.75rem,6.5vw,7rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
              <span>
                Work that <Serif className="normal-case text-ember">moves.</Serif>
              </span>
            </Lines>
          </div>
          <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:items-end lg:text-right">
            <p className="max-w-sm text-[15px] leading-relaxed text-paper/55">
              Cinematic AI creative, high-retention motion and performance video engineered to turn attention into revenue.
            </p>
            <PillLink to="/work" variant="outline">
              All projects ({String(works.length).padStart(2, '0')})
            </PillLink>
          </div>
        </div>

        <div className="mt-16 grid gap-x-6 gap-y-14 lg:grid-cols-12 lg:gap-y-20">
          {works.map((work, i) => (
            <Reveal key={work.id} className={LAYOUT[i % LAYOUT.length]} delay={(i % 2) * 0.1}>
              <Link to={`/work/${work.slug}`} data-work-card data-cursor="View" className="group block">
                <WorkMedia work={work} className="h-[62vw] rounded-[1.5rem] sm:h-[48vw] lg:h-[min(38vw,640px)]" />
                <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-start gap-5">
                  <span className="pt-1 text-[11px] tracking-[0.2em] text-ember">{work.number}</span>
                  <div>
                    <h3 className="font-display text-[clamp(1.35rem,2vw,2rem)] font-medium uppercase leading-[1] tracking-[-0.03em]">{work.title}</h3>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-paper/45">{work.category}</p>
                  </div>
                  <span className="arrow-swap h-11 w-11 rounded-full border border-paper/20 transition-colors duration-500 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                    <ArrowUpRight size={17} />
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------
   Capabilities — interactive list + detail panel
------------------------------------------------------------------- */

function Capabilities() {
  const [active, setActive] = useState(0)
  const s = services[active]
  const Icon = s.icon

  return (
    <section className="border-t border-paper/10 py-24 md:py-36">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow index="004">Capabilities</Eyebrow>
            <Lines className="mt-6 font-display text-[clamp(2.75rem,6.5vw,7rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
              <span>Four engines.</span>
              <span>
                <Serif className="normal-case text-ember">One</Serif> studio.
              </span>
            </Lines>
          </div>
          <Words
            className="max-w-sm text-[15px] leading-relaxed text-paper/55 lg:col-span-4 lg:justify-self-end lg:text-right"
            text="One creative partner from concept to delivery — video, motion, AI and web under one roof."
          />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="border-b border-paper/10 lg:col-span-6" role="tablist" aria-label="Services">
            {services.map((item, i) => {
              const on = i === active
              return (
                <button
                  key={item.slug}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 border-t border-paper/10 py-7 text-left md:py-8"
                >
                  <span className={`absolute left-0 top-0 h-px bg-ember transition-all duration-700 ease-expo ${on ? 'w-full' : 'w-0'}`} />
                  <span className={`text-[11px] tracking-[0.2em] transition-colors ${on ? 'text-ember' : 'text-paper/35'}`}>{item.n}</span>
                  <span
                    className={`font-display text-[clamp(1.75rem,3.4vw,3.5rem)] font-medium uppercase leading-[0.95] tracking-[-0.045em] transition-all duration-500 ease-expo ${
                      on ? 'translate-x-2 text-paper' : 'text-paper/30 group-hover:text-paper/60'
                    }`}
                  >
                    {item.title}
                  </span>
                  <ArrowRight size={20} className={`transition-all duration-500 ${on ? 'text-ember' : '-translate-x-2 text-paper/0'}`} />
                </button>
              )
            })}
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[460px] overflow-hidden rounded-[1.75rem] border border-paper/10 bg-ink-2 p-7 md:p-10 lg:sticky lg:top-28">
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(255_91_31/0.22),transparent_65%)]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex h-full flex-col"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-ember text-ink">
                      <Icon size={22} strokeWidth={1.6} />
                    </span>
                    <span className="text-outline font-display text-[6rem] font-medium leading-[0.8] tracking-[-0.07em]">{s.n}</span>
                  </div>
                  <h3 className="mt-10 font-display text-[clamp(2rem,3vw,3rem)] font-medium uppercase leading-[0.95] tracking-[-0.045em]">{s.title}</h3>
                  <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-paper/60">{s.detail}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {s.deliverables.map((d) => (
                      <span key={d} className="rounded-full border border-paper/15 px-3.5 py-1.5 text-[12px] text-paper/70">
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-10">
                    <PillLink to={`/services#${s.slug}`} variant="solid">
                      Explore {s.title}
                    </PillLink>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------
   Numbers
------------------------------------------------------------------- */

function Numbers() {
  return (
    <section className="pb-24 md:pb-36">
      <Container>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-paper/10 bg-paper/10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col bg-ink p-6 md:p-10">
                <span className="text-[11px] tracking-[0.2em] text-paper/35">0{i + 1}</span>
                <Counter
                  value={s.value}
                  suffix={s.suffix}
                  className="mt-10 block font-display text-[clamp(3rem,6.5vw,6.5rem)] font-medium leading-none tracking-[-0.06em] tabular-nums"
                />
                <p className="mt-4 max-w-[15rem] text-sm leading-relaxed text-paper/50">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------
   Process
------------------------------------------------------------------- */

function ProcessTeaser() {
  const scope = useGsap(() => {
    gsap.fromTo('[data-process-line]', { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '[data-process]', start: 'top 75%', end: 'bottom 65%', scrub: true },
    })
  })

  return (
    <section ref={scope} className="border-t border-paper/10 py-24 md:py-36">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow index="005">The flow</Eyebrow>
            <Lines className="mt-6 font-display text-[clamp(2.75rem,6.5vw,7rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
              <span>
                Idea to <Serif className="normal-case text-ember">impact.</Serif>
              </span>
            </Lines>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <PillLink to="/services" variant="outline">
              How we work
            </PillLink>
          </div>
        </div>

        <div data-process className="relative mt-16">
          <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-paper/10 md:block">
            <div data-process-line className="h-full origin-left bg-ember" />
          </div>
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
            {process.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <span className="relative z-10 block h-[15px] w-[15px] rounded-full border-2 border-ember bg-ink" />
                <p className="mt-8 text-[11px] tracking-[0.2em] text-ember">{step.n}</p>
                <h3 className="mt-3 font-display text-4xl font-medium uppercase tracking-[-0.04em]">{step.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/50">{step.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */

export default function Home() {
  const [playing, setPlaying] = useState(null)
  const close = useCallback(() => setPlaying(null), [])

  return (
    <Page title="" label="Ark">
      <Hero onPlay={setPlaying} />
      <Marquee
        items={['Video editing', 'Motion graphics', 'AI UGC ads', 'Web experiences', 'Creative technology']}
        className="border-y border-paper/10 py-5 font-display text-[clamp(1.5rem,3vw,2.75rem)] font-medium uppercase tracking-[-0.03em] text-paper/70"
        duration={35}
      />
      <div className="pt-16 md:pt-24">
        <StudioIntro />
      </div>
      <div className="relative z-10 -mt-8 rounded-t-[2rem] bg-ink md:-mt-12 md:rounded-t-[3rem]">
        <SelectedWork />
        <Capabilities />
        <Numbers />
        <ProcessTeaser />
      </div>

      <AnimatePresence>{playing ? <VideoModal key={playing.id} work={playing} onClose={close} /> : null}</AnimatePresence>
    </Page>
  )
}
