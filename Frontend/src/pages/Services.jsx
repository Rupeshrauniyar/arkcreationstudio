import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowDownRight, Check } from 'lucide-react'
import Page from '../components/Page'
import { Eyebrow, Lines, Marquee, PillLink, Reveal, Serif, Words } from '../components/ui'
import { gsap, introDelay, scrollToTarget, ScrollTrigger, useGsap } from '../lib/motion'
import { engagements, process, services } from '../data/site'

/* ------------------------------------------------------------------
   Sticky index + detailed service chapters
------------------------------------------------------------------- */

function ServiceChapters() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const triggers = services.map((s, i) =>
      ScrollTrigger.create({
        trigger: `#${s.slug}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setActive(i),
      })
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  const scope = useGsap(() => {
    gsap.utils.toArray('[data-chapter]').forEach((chapter) => {
      gsap.from(chapter.querySelectorAll('[data-chapter-num]'), {
        yPercent: 40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'top 40%', scrub: true },
      })
      gsap.from(chapter.querySelectorAll('[data-tag]'), {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: chapter.querySelector('[data-tags]'), start: 'top 90%', once: true },
      })
    })
  })

  return (
    <section ref={scope} className="px-5 md:px-10">
      <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-12">
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-32">
            <p className="mb-8 text-[11px] uppercase tracking-[0.22em] text-paper/40">Index</p>
            <ul className="space-y-1">
              {services.map((s, i) => (
                <li key={s.slug}>
                  <button
                    type="button"
                    onClick={() => scrollToTarget(`#${s.slug}`, -110)}
                    className={`group flex w-full items-center gap-4 py-3 text-left transition-colors duration-500 ${
                      active === i ? 'text-paper' : 'text-paper/35 hover:text-paper/70'
                    }`}
                    aria-current={active === i ? 'true' : undefined}
                  >
                    <span className={`h-px transition-all duration-700 ease-expo ${active === i ? 'w-14 bg-ember' : 'w-6 bg-paper/30'}`} />
                    <span className="text-[11px] tracking-[0.2em]">{s.n}</span>
                    <span className="font-display text-3xl font-medium uppercase tracking-[-0.04em]">{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-12 h-px w-full bg-paper/10">
              <div
                className="h-full origin-left bg-ember transition-transform duration-700 ease-expo"
                style={{ transform: `scaleX(${(active + 1) / services.length})` }}
              />
            </div>
          </div>
        </aside>

        <div className="lg:col-span-8">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <article
                key={s.slug}
                id={s.slug}
                data-chapter
                className="scroll-mt-28 border-t border-paper/10 py-20 md:py-28"
              >
                <div className="flex items-start justify-between gap-6">
                  <span
                    data-chapter-num
                    className="text-outline font-display text-[clamp(6rem,16vw,14rem)] font-medium leading-[0.75] tracking-[-0.07em]"
                  >
                    {s.n}
                  </span>
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-paper/15 text-ember md:h-20 md:w-20">
                    <Icon size={26} strokeWidth={1.4} />
                  </span>
                </div>

                <Lines className="mt-10 font-display text-[clamp(2.75rem,6.5vw,6.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
                  <span>{s.title}</span>
                </Lines>

                <Words className="mt-8 max-w-2xl font-display text-[clamp(1.25rem,2vw,1.85rem)] leading-[1.25] tracking-[-0.02em] text-paper/85" text={s.short} />
                <Reveal>
                  <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-paper/55">{s.detail}</p>
                </Reveal>

                <div className="mt-14 grid gap-12 md:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-ember">What we deliver</p>
                    <div data-tags className="mt-6 flex flex-wrap gap-2">
                      {s.deliverables.map((d) => (
                        <span
                          key={d}
                          data-tag
                          className="rounded-full border border-paper/15 px-4 py-2 text-[13px] text-paper/75 transition-colors duration-300 hover:border-ember hover:bg-ember hover:text-ink"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Reveal>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-ember">Ideal for</p>
                    <ul className="mt-6 space-y-3">
                      {s.idealFor.map((x) => (
                        <li key={x} className="flex items-center gap-3 text-[15px] text-paper/70">
                          <Check size={15} className="shrink-0 text-ember" /> {x}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Process — sticky stacking cards
------------------------------------------------------------------- */

function ProcessStack() {
  const scope = useGsap(() => {
    const cards = gsap.utils.toArray('[data-stack-card]')
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      if (!next) return
      gsap.to(card.querySelector('[data-stack-inner]'), {
        scale: 0.92,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: true },
      })
    })
  })

  return (
    <section ref={scope} className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow index="02">The flow</Eyebrow>
            <Lines className="mt-6 font-display text-[clamp(2.75rem,7vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
              <span>From idea</span>
              <span className="text-paper/35">
                to <Serif className="normal-case text-ember">impact.</Serif>
              </span>
            </Lines>
          </div>
          <Words
            className="max-w-sm text-[15px] leading-relaxed text-paper/55"
            text="Simple process. Clear communication. No mystery around timelines, revisions or deliverables."
          />
        </div>

        <div className="space-y-6">
          {process.map((step, i) => (
            <div key={step.n} data-stack-card className="sticky" style={{ top: `${110 + i * 28}px` }}>
              <div
                data-stack-inner
                className="grid origin-top gap-10 rounded-3xl border border-paper/10 bg-ink-2 p-7 md:min-h-[440px] md:grid-cols-12 md:p-12"
              >
                <div className="flex flex-col justify-between gap-10 md:col-span-5">
                  <span className="text-[11px] tracking-[0.2em] text-ember">Step {step.n}</span>
                  <h3 className="font-display text-[clamp(3.5rem,9vw,9rem)] font-medium uppercase leading-[0.8] tracking-[-0.07em]">
                    {step.title}
                    <span className="text-ember">.</span>
                  </h3>
                </div>
                <div className="flex flex-col justify-between gap-10 md:col-span-6 md:col-start-7">
                  <p className="font-display text-[clamp(1.25rem,2vw,1.85rem)] leading-[1.25] tracking-[-0.02em] text-paper/80">{step.copy}</p>
                  <ul className="grid gap-3 border-t border-paper/10 pt-6 sm:grid-cols-3">
                    {step.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-paper/55">
                        <span className="h-1.5 w-1.5 rounded-full bg-ember" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Engagement models — spotlight cards
------------------------------------------------------------------- */

function Engagements() {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <section className="border-t border-paper/10 px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-16">
          <Eyebrow index="03">Ways to work together</Eyebrow>
          <Lines className="mt-6 font-display text-[clamp(2.75rem,7vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
            <span>
              Pick your <Serif className="normal-case text-ember">pace.</Serif>
            </span>
          </Lines>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {engagements.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.1}>
              <div
                onPointerMove={onMove}
                className={`spotlight flex h-full min-h-[420px] flex-col justify-between rounded-3xl border p-8 transition-colors duration-500 md:p-10 ${
                  e.featured ? 'border-ember/50 bg-ember/[0.06]' : 'border-paper/10 bg-ink-2 hover:border-paper/25'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.2em] text-paper/40">0{i + 1}</span>
                    {e.featured ? (
                      <span className="rounded-full bg-ember px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">Popular</span>
                    ) : null}
                  </div>
                  <h3 className="mt-14 font-display text-4xl font-medium uppercase tracking-[-0.04em] md:text-5xl">{e.title}</h3>
                  <p className="mt-5 text-[15px] leading-relaxed text-paper/60">{e.copy}</p>
                </div>
                <ul className="mt-10 space-y-3 border-t border-paper/10 pt-6">
                  {e.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-paper/70">
                      <Check size={15} className="text-ember" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-paper/10 p-8 md:flex-row md:items-center md:p-10">
          <p className="max-w-xl font-display text-2xl tracking-[-0.02em] md:text-3xl">
            Not sure which fits? Tell us what you’re trying to move — we’ll scope it with you.
          </p>
          <PillLink to="/contact" variant="ember">
            Start a conversation
          </PillLink>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */

export default function Services() {
  const delay = introDelay()
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return undefined
    const t = setTimeout(() => scrollToTarget(hash, -110), delay * 1000 + 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])

  return (
    <Page title="Services" label="Services">
      <section className="relative overflow-hidden px-5 pb-20 pt-36 md:px-10 md:pb-28 md:pt-48">
        <div className="orb pointer-events-none absolute -right-[15%] top-[10%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgb(255_91_31/0.35),transparent_60%)] blur-3xl" />
        <div className="relative mx-auto max-w-[1680px]">
          <Eyebrow index="S">What we build</Eyebrow>
          <Lines
            as="h1"
            trigger="load"
            delay={delay}
            className="mt-8 font-display text-[clamp(3.75rem,13vw,14rem)] font-medium uppercase leading-[0.84] tracking-[-0.07em]"
          >
            <span>
              <span className="text-outline">Four</span> engines.
            </span>
            <span>
              <Serif className="normal-case text-ember">One</Serif> studio.
            </span>
          </Lines>

          <div className="mt-16 grid gap-10 md:grid-cols-12 md:items-end">
            <Words
              trigger="load"
              delay={delay + 0.3}
              className="max-w-xl text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-paper/60 md:col-span-6"
              text="One creative partner from concept to delivery. We keep video, motion, AI and web under one roof so ideas move faster and stay consistent."
            />
            <div className="flex flex-wrap gap-2 md:col-span-6 md:justify-end">
              {services.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => scrollToTarget(`#${s.slug}`, -110)}
                  className="group inline-flex items-center gap-2 rounded-full border border-paper/15 px-4 py-2.5 text-[13px] text-paper/75 transition-colors hover:border-ember hover:bg-ember hover:text-ink"
                >
                  {s.title}
                  <ArrowDownRight size={14} className="transition-transform duration-500 group-hover:rotate-45" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Marquee
        items={services.map((s) => s.title)}
        className="border-y border-paper/10 bg-ember py-5 font-display text-[clamp(1.75rem,4vw,3.5rem)] font-medium uppercase tracking-[-0.03em] text-ink"
        separator={<span className="mx-[0.5em]">✺</span>}
        duration={30}
      />

      <div className="pt-12">
        <ServiceChapters />
      </div>
      <ProcessStack />
      <Engagements />
    </Page>
  )
}
