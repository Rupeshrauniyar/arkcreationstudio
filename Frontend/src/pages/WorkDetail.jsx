import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, Play } from 'lucide-react'
import Page from '../components/Page'
import Player from '../components/Player'
import { Eyebrow, Lines, PillLink, Reveal, Serif, Words } from '../components/ui'
import { gsap, introDelay, useGsap } from '../lib/motion'
import { findWork, works } from '../data/works'

function NotFoundProject() {
  return (
    <Page title="Project not found" label="404">
      <section className="flex min-h-[80svh] flex-col items-center justify-center gap-8 px-5 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ember">(404)</p>
        <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-medium uppercase leading-[0.9] tracking-[-0.06em]">
          Project <Serif className="normal-case text-ember">not found</Serif>
        </h1>
        <PillLink to="/work">Back to all work</PillLink>
      </section>
    </Page>
  )
}

export default function WorkDetail() {
  const { slug } = useParams()
  const work = findWork(slug)
  const [playing, setPlaying] = useState(false)
  const delay = introDelay()

  const scope = useGsap(() => {
    gsap.from('[data-detail-fade]', { opacity: 0, y: 30, duration: 1.2, stagger: 0.08, ease: 'expo.out', delay: delay + 0.4 })
    gsap.fromTo(
      '[data-detail-media]',
      { clipPath: 'inset(8% 6% 0% 6% round 28px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 16px)',
        ease: 'none',
        scrollTrigger: { trigger: '[data-detail-media]', start: 'top 85%', end: 'top 15%', scrub: true },
      }
    )
    gsap.fromTo('[data-detail-media] img', { scale: 1.2 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '[data-detail-media]', start: 'top bottom', end: 'bottom top', scrub: true },
    })
    gsap.from('[data-next-title]', {
      yPercent: 40,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: '[data-next]', start: 'top bottom', end: 'center 70%', scrub: 1 },
    })
  }, [slug])

  if (!work) return <NotFoundProject />

  const index = works.findIndex((w) => w.id === work.id)
  const next = works[(index + 1) % works.length]
  const titleParts = work.title.split(' / ')

  const meta = [
    { label: 'Client', value: work.client },
    { label: 'Discipline', value: work.discipline },
    { label: 'Format', value: work.format },
    { label: 'Duration', value: work.duration },
    { label: 'Language', value: work.language },
    { label: 'Timeline', value: work.turnaround },
  ].filter((m) => m.value)

  const vertical = work.orientation === 'vertical'
  const frames = work.frame ? ['6p', '28p', '50p', '72p', '92p'].map((at) => work.frame(at, 480)) : []

  return (
    <Page title={work.title} label={`Case ${work.number}`}>
      <div ref={scope}>
        {/* Hero */}
        <section className="px-5 pb-14 pt-32 md:px-10 md:pb-20 md:pt-44">
          <div className="mx-auto max-w-[1680px]">
            <div data-detail-fade className="mb-12 flex items-center justify-between gap-6">
              <Link to="/work" className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-paper/60 hover:text-paper">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-paper/20 transition-colors group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                  <ArrowLeft size={15} className="transition-transform duration-500 group-hover:-translate-x-0.5" />
                </span>
                All work
              </Link>
              <span className="text-[11px] uppercase tracking-[0.2em] text-paper/40">
                Case {work.number} / {String(works.length).padStart(2, '0')}
              </span>
            </div>

            <Eyebrow index={work.number}>{work.category}</Eyebrow>
            <Lines
              as="h1"
              trigger="load"
              delay={delay}
              className="mt-8 font-display text-[clamp(2.8rem,9vw,10rem)] font-medium uppercase leading-[0.86] tracking-[-0.065em]"
            >
              {titleParts.map((part, i) => (
                <span key={part} className={i === 1 ? 'text-paper/40' : ''}>
                  {part}
                </span>
              ))}
            </Lines>

            <div
              className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-3 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
              style={{ '--cols': meta.length }}
            >
              {meta.map((m) => (
                <div key={m.label} data-detail-fade className="bg-ink p-5 md:p-7">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-paper/40">{m.label}</p>
                  <p className="mt-3 font-display text-lg tracking-[-0.02em] md:text-xl">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="px-3 md:px-5">
          <div
            data-detail-media
            className={`relative mx-auto min-h-[420px] max-w-[1880px] overflow-hidden rounded-2xl bg-ink-3 ${vertical ? 'h-[88svh]' : 'h-[78svh]'}`}
          >
            {vertical ? (
              <>
                <img src={work.poster} alt="" aria-hidden="true" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-3xl" />
                <div className="absolute inset-0 bg-ink/40" />
              </>
            ) : null}

            <div className={vertical ? 'relative flex h-full items-center justify-center py-6 md:py-8' : 'absolute inset-0'}>
              <div
                className={vertical ? 'relative h-full max-w-full overflow-hidden rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.6)] ring-1 ring-paper/15' : 'absolute inset-0'}
                style={vertical ? { aspectRatio: '9 / 16' } : undefined}
              >
                {playing ? (
                  <Player work={work} />
                ) : (
                  <button
                    type="button"
                    data-cursor="Play"
                    onClick={() => setPlaying(true)}
                    className="group absolute inset-0 block h-full w-full"
                    aria-label={`Play ${work.title}`}
                  >
                    <img src={work.poster} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute inset-0 bg-ink/30 transition-colors duration-700 group-hover:bg-ink/10" />
                    <span className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ember text-ink shadow-[0_0_80px_rgb(255_91_31/0.5)] transition-transform duration-700 ease-expo group-hover:scale-110 md:h-32 md:w-32">
                      <Play size={28} fill="currentColor" className="translate-x-0.5" />
                    </span>
                    <span className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-paper/85">
                      <span>Play film</span>
                      {work.duration ? <span>{work.duration}</span> : null}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Key frames */}
        {frames.length ? (
          <section className="px-5 pt-20 md:px-10 md:pt-28">
            <div className="mx-auto max-w-[1680px]">
              <div className="mb-8 flex items-end justify-between gap-6">
                <Eyebrow index="00">Key frames</Eyebrow>
                <span className="text-[11px] uppercase tracking-[0.2em] text-paper/35">Beginning → end</span>
              </div>
              <div className={`no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0`}>
                {frames.map((src, i) => (
                  <Reveal key={src} delay={i * 0.06} className="w-[42vw] shrink-0 snap-start md:w-auto">
                    <figure className="group">
                      <div
                        className="overflow-hidden rounded-xl bg-ink-3 ring-1 ring-paper/10"
                        style={{ aspectRatio: vertical ? '9 / 16' : '16 / 9' }}
                      >
                        <img src={src} alt={`${work.title} — frame ${i + 1}`} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105" />
                      </div>
                      <figcaption className="mt-3 text-[11px] tracking-[0.2em] text-paper/35">0{i + 1}</figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Overview */}
        <section className="px-5 py-28 md:px-10 md:py-40">
          <div className="mx-auto grid max-w-[1680px] gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <Eyebrow index="01">Overview</Eyebrow>
                <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/45">
                  A look at the thinking behind {work.title.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())}.
                </p>
              </div>
            </div>
            <div className="lg:col-span-8">
              <Words
                className="font-display text-[clamp(1.75rem,3.4vw,3.4rem)] font-medium leading-[1.08] tracking-[-0.035em]"
                text={work.description}
              />

              <div className="mt-20 grid gap-12 md:grid-cols-2">
                <Reveal>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ember">The brief</p>
                  <p className="mt-5 text-[15px] leading-relaxed text-paper/65">{work.brief}</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ember">Our approach</p>
                  <p className="mt-5 text-[15px] leading-relaxed text-paper/65">{work.approach}</p>
                </Reveal>
              </div>

              <Reveal className="mt-20">
                <p className="text-[11px] uppercase tracking-[0.2em] text-paper/40">What we delivered</p>
                <ul className="mt-6 border-t border-paper/10">
                  {work.deliverables.map((d, i) => (
                    <li key={d} className="group flex items-center justify-between border-b border-paper/10 py-5">
                      <span className="flex items-center gap-5">
                        <span className="text-[11px] tracking-[0.2em] text-paper/35">0{i + 1}</span>
                        <span className="font-display text-xl tracking-[-0.02em] transition-transform duration-500 ease-expo group-hover:translate-x-2 md:text-2xl">
                          {d}
                        </span>
                      </span>
                      <Check size={16} className="text-ember" />
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-14 flex flex-wrap gap-2">
                {work.tags.map((t) => (
                  <span key={t} className="rounded-full border border-paper/15 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-paper/60">
                    {t}
                  </span>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* Next project */}
        {next.id !== work.id ? (
        <section data-next className="border-t border-paper/10">
          <Link
            to={`/work/${next.slug}`}
            data-cursor="Next"
            className="group relative block overflow-hidden px-5 py-28 md:px-10 md:py-40"
          >
            <img
              src={next.poster}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-[1.2s] ease-expo group-hover:scale-100 group-hover:opacity-30"
            />
            <div className="relative mx-auto max-w-[1680px]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-paper/50">
                <span className="text-ember">(Next)</span> — {next.category}
              </p>
              <div data-next-title className="mt-8 flex items-end justify-between gap-8">
                <h2 className="font-display text-[clamp(2.5rem,8vw,9rem)] font-medium uppercase leading-[0.86] tracking-[-0.065em]">
                  {next.title.split(' / ')[0]}
                </h2>
                <span className="mb-2 grid h-20 w-20 shrink-0 place-items-center rounded-full border border-paper/25 transition-all duration-700 ease-expo group-hover:rotate-45 group-hover:border-ember group-hover:bg-ember group-hover:text-ink md:h-32 md:w-32">
                  <ArrowUpRight size={32} />
                </span>
              </div>
            </div>
          </Link>
        </section>
        ) : null}
      </div>
    </Page>
  )
}
