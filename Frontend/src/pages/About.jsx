import React, { useMemo } from 'react'
import Page from '../components/Page'
import Globe from '../components/Globe'
import { Eyebrow, Lines, Marquee, PillLink, Reveal, Serif, Words, useClock } from '../components/ui'
import { gsap, introDelay, useGsap } from '../lib/motion'
import { values } from '../data/site'

/* ------------------------------------------------------------------
   Time zone helper — difference between viewer and Kathmandu
------------------------------------------------------------------- */

function useTimeDifference() {
  return useMemo(() => {
    const now = new Date()
    const toMinutes = (tz) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).formatToParts(now)
      const get = (t) => Number(parts.find((p) => p.type === t)?.value)
      return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute')) / 60000
    }
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone
    const diff = toMinutes('Asia/Kathmandu') - toMinutes(local)
    if (diff === 0) return { local, text: 'You’re on studio time — same clock as us.' }
    const abs = Math.abs(diff)
    const h = Math.floor(abs / 60)
    const m = abs % 60
    const span = `${h ? `${h}h` : ''}${m ? ` ${m}m` : ''}`.trim()
    return { local, text: diff > 0 ? `We’re ${span} ahead of you — work moves while you sleep.` : `We’re ${span} behind you — your morning brief, our evening build.` }
  }, [])
}

/* ------------------------------------------------------------------
   Values — interactive cards
------------------------------------------------------------------- */

function Values() {
  return (
    <section className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-16 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow index="02">Why ARK</Eyebrow>
            <Lines className="mt-6 font-display text-[clamp(2.75rem,7vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
              <span>Four reasons</span>
              <span>
                teams <Serif className="normal-case text-ember">stay.</Serif>
              </span>
            </Lines>
          </div>
          <Words
            className="max-w-md text-[15px] leading-relaxed text-paper/55 md:col-span-5"
            text="We’re built to move at campaign speed without trading away quality. Here’s what that looks like in practice."
          />
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="h-full">
              <div tabIndex={0} className="group relative flex h-full min-h-[380px] flex-col justify-between overflow-hidden bg-ink p-7 outline-none md:min-h-[460px] md:p-9">
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ember transition-transform duration-700 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100" />
                <div className="relative flex items-center justify-between text-[11px] tracking-[0.2em] text-paper/40 transition-colors duration-500 group-hover:text-ink/70">
                  <span>{v.n}</span>
                  <span className="h-2 w-2 rounded-full bg-ember transition-colors duration-500 group-hover:bg-ink" />
                </div>
                <div className="relative">
                  <h3 className="font-display text-[clamp(3rem,5vw,4.75rem)] font-medium uppercase leading-[0.85] tracking-[-0.06em] transition-colors duration-500 group-hover:text-ink">
                    {v.title}
                    <span className="text-ember transition-colors duration-500 group-hover:text-ink">.</span>
                  </h3>
                  <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-paper/55 transition-colors duration-500 group-hover:text-ink/80">{v.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Global section — interactive globe + clocks
------------------------------------------------------------------- */

function Global() {
  const ktm = useClock('Asia/Kathmandu', true)
  const { local, text } = useTimeDifference()
  const yours = useClock(local, true)

  return (
    <section className="relative overflow-hidden border-y border-paper/10 bg-ink-2 px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1680px] items-center gap-16 lg:grid-cols-2">
        <div>
          <Eyebrow index="03">Global by default</Eyebrow>
          <Lines className="mt-6 font-display text-[clamp(2.75rem,6.5vw,7rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
            <span>Local roots.</span>
            <span>
              <Serif className="normal-case text-ember">Global</Serif> output.
            </span>
          </Lines>
          <Words
            className="mt-10 max-w-xl text-[15px] leading-relaxed text-paper/60"
            text="ARK is built in Nepal and works beyond borders. We collaborate asynchronously with brands, creators and teams that need fast, premium creative without the overhead of a traditional agency."
          />

          <Reveal className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10">
            <div className="bg-ink-2 p-6">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-paper/40">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" /> Kathmandu
              </p>
              <p className="mt-3 font-display text-3xl tabular-nums tracking-[-0.02em] md:text-4xl">{ktm}</p>
            </div>
            <div className="bg-ink-2 p-6">
              <p className="truncate text-[11px] uppercase tracking-[0.2em] text-paper/40">You · {local.split('/').pop().replace('_', ' ')}</p>
              <p className="mt-3 font-display text-3xl tabular-nums tracking-[-0.02em] text-paper/70 md:text-4xl">{yours}</p>
            </div>
            <p className="col-span-2 bg-ink-2 px-6 pb-6 text-sm text-ember">{text}</p>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap gap-2">
            {['Nepal', 'Remote', 'Worldwide', '24/7 creative'].map((x) => (
              <span key={x} className="rounded-full border border-paper/15 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-paper/60">
                {x}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal className="relative">
          <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgb(255_91_31/0.25),transparent_65%)] blur-2xl" />
          <Globe className="relative mx-auto aspect-square w-full max-w-[640px]" />
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-paper/35">
            <span className="text-ember">●</span> Studio HQ — 28.2° N, 84.1° E
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Async workflow
------------------------------------------------------------------- */

const WORKFLOW = [
  { title: 'Brief async', copy: 'Send a brief, a voice note, a loom — whatever’s fastest. We turn it into a clear scope.' },
  { title: 'Progress you can see', copy: 'Early cuts and direction checks land in your inbox, so you’re never guessing.' },
  { title: 'Feedback in context', copy: 'Timestamped notes on the actual work. Focused revisions, no endless calls.' },
  { title: 'Delivered ready', copy: 'Every format, every ratio, organised and ready to publish or put into ads.' },
]

function Workflow() {
  const scope = useGsap(() => {
    gsap.utils.toArray('[data-flow-row]').forEach((row) => {
      gsap.from(row, {
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: row, start: 'top 88%', once: true },
      })
    })
  })

  return (
    <section ref={scope} className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1680px]">
        <Eyebrow index="04">How we collaborate</Eyebrow>
        <Lines className="mt-6 font-display text-[clamp(2.75rem,7vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
          <span>
            Async, <Serif className="normal-case text-ember">not</Serif>
          </span>
          <span>absent.</span>
        </Lines>

        <div className="mt-20 border-b border-paper/10">
          {WORKFLOW.map((w, i) => (
            <div key={w.title} data-flow-row className="group grid gap-4 border-t border-paper/10 py-10 md:grid-cols-12 md:items-center md:py-12">
              <span className="text-[11px] tracking-[0.2em] text-ember md:col-span-1">0{i + 1}</span>
              <h3 className="font-display text-[clamp(1.75rem,3.6vw,3.5rem)] font-medium uppercase leading-[0.95] tracking-[-0.045em] transition-transform duration-700 ease-expo group-hover:translate-x-3 md:col-span-6">
                {w.title}
              </h3>
              <p className="max-w-md text-[15px] leading-relaxed text-paper/55 md:col-span-5">{w.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */

export default function About() {
  const delay = introDelay()

  const scope = useGsap(() => {
    gsap.to('[data-about-orb]', {
      yPercent: 40,
      ease: 'none',
      scrollTrigger: { trigger: '[data-about-hero]', start: 'top top', end: 'bottom top', scrub: true },
    })
  })

  return (
    <Page title="Studio" label="Studio">
      <div ref={scope}>
        <section data-about-hero className="relative overflow-hidden px-5 pb-24 pt-36 md:px-10 md:pb-32 md:pt-48">
          <div data-about-orb className="pointer-events-none absolute -right-[10%] top-[5%] h-[55vmax] w-[55vmax]">
            <div className="orb h-full w-full rounded-full bg-[radial-gradient(circle_at_40%_38%,#ffca5b_0%,#ff5b1f_14%,#c62f00_30%,#1a0700_50%,transparent_68%)] opacity-60 blur-2xl" />
          </div>

          <div className="relative mx-auto max-w-[1680px]">
            <Eyebrow index="A">The studio</Eyebrow>
            <Lines
              as="h1"
              trigger="load"
              delay={delay}
              className="mt-8 font-display text-[clamp(3.5rem,12vw,13rem)] font-medium uppercase leading-[0.84] tracking-[-0.07em]"
            >
              <span>Big-studio</span>
              <span>
                <Serif className="normal-case text-ember">energy.</Serif>
              </span>
              <span className="text-paper/40">Lean-studio</span>
              <span className="text-paper/40">pricing.</span>
            </Lines>
          </div>
        </section>

        <section className="relative z-10 rounded-t-[2rem] bg-paper px-5 py-28 text-ink md:rounded-t-[3rem] md:px-10 md:py-40">
          <div className="mx-auto grid max-w-[1680px] gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow index="01" tone="light">
                Who we are
              </Eyebrow>
            </div>
            <div className="lg:col-span-8">
              <Words
                className="font-display text-[clamp(1.9rem,3.8vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.04em]"
                text="ARK Creation Studio is an independent creative and technology studio built on one belief: premium creative work shouldn’t require premium agency budgets."
              />
              <div className="mt-16 grid gap-10 md:grid-cols-2">
                <Reveal>
                  <p className="text-[15px] leading-relaxed text-ink/70">
                    We combine cutting-edge tools, obsessive attention to craft and lean operations to deliver work that competes with studios many times our size. Editing, motion, AI and web live under one roof — so nothing gets lost in hand-offs.
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="text-[15px] leading-relaxed text-ink/70">
                    No bloated retainers, no layers of account managers. You talk directly to the people making the work, and more of your budget goes into what people actually see.
                  </p>
                </Reveal>
              </div>
              <Reveal className="mt-14">
                <PillLink to="/work" variant="dark">
                  See what we make
                </PillLink>
              </Reveal>
            </div>
          </div>
        </section>

        <div className="relative z-10 -mt-8 rounded-t-[2rem] bg-ink md:-mt-12 md:rounded-t-[3rem]">
          <Values />
          <Global />
          <Marquee
            items={['No bloated retainers', 'Craft over volume', 'Speed without shortcuts', 'Direct to the makers']}
            className="border-b border-paper/10 py-8 font-display text-[clamp(2rem,5vw,4.5rem)] font-medium uppercase tracking-[-0.04em] text-paper/80"
            duration={40}
          />
          <Workflow />
        </div>
      </div>
    </Page>
  )
}
