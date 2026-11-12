import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, LayoutGrid, Rows3 } from 'lucide-react'
import Page from '../components/Page'
import WorkMedia from '../components/WorkMedia'
import { Eyebrow, Lines, Marquee, Serif, Words } from '../components/ui'
import { gsap, introDelay } from '../lib/motion'
import { works } from '../data/works'

const FILTERS = ['All', ...Array.from(new Set(works.flatMap((w) => w.tags)))]

const KEEP_UPPER = new Set(['AI', 'UGC', '3D', 'TV', 'VFX', 'CGI'])
const titleCase = (s) =>
  s
    .split(' ')
    .map((w) => (KEEP_UPPER.has(w.toUpperCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ')

/* ------------------------------------------------------------------
   Grid view — staggered two-column layout
------------------------------------------------------------------- */

function GridView({ items }) {
  return (
    <motion.div layout className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-24">
      <AnimatePresence mode="popLayout">
        {items.map((work, i) => (
          <motion.article
            key={work.id}
            layout
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.4 } }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className={i % 2 === 1 ? 'md:mt-40' : ''}
          >
            <Link to={`/work/${work.slug}`} className="group block" data-cursor="View">
              <div className="relative">
                <WorkMedia work={work} className={`rounded-2xl ${i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[16/12]'}`} />
                <span className="absolute bottom-4 left-4 rounded-full bg-ink/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl">
                  {work.number} / {String(works.length).padStart(2, '0')}
                </span>
                <span className="absolute bottom-4 right-4 grid h-14 w-14 scale-0 place-items-center rounded-full bg-ember text-ink transition-transform duration-700 ease-expo group-hover:scale-100">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <div className="mt-6 flex items-start justify-between gap-6 border-b border-paper/10 pb-6">
                <div>
                  <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.6rem)] font-medium uppercase leading-[0.95] tracking-[-0.035em]">
                    {work.title}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/50">{work.description}</p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
                  {work.tags.map((t) => (
                    <span key={t} className="rounded-full border border-paper/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-paper/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

/* ------------------------------------------------------------------
   List view — rows with cursor-following preview
------------------------------------------------------------------- */

function ListView({ items }) {
  const [active, setActive] = useState(null)
  const preview = useRef(null)


  useEffect(() => {
    const el = preview.current
    if (!el) return undefined
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
    const move = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <div className="relative" onPointerLeave={() => setActive(null)}>
      <div className="hidden grid-cols-12 gap-4 border-b border-paper/15 pb-4 text-[11px] uppercase tracking-[0.2em] text-paper/35 md:grid">
        <span className="col-span-1">No.</span>
        <span className="col-span-6">Project</span>
        <span className="col-span-3">Discipline</span>
        <span className="col-span-2 text-right">Format</span>
      </div>

      {items.map((work, i) => (
        <motion.div
          key={work.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to={`/work/${work.slug}`}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`group grid grid-cols-12 items-center gap-4 border-b border-paper/15 py-8 transition-opacity duration-500 md:py-10 ${
              active !== null && active !== i ? 'opacity-35' : 'opacity-100'
            }`}
          >
            <span className="col-span-2 text-[11px] tracking-[0.2em] text-ember md:col-span-1">{work.number}</span>
            <span className="col-span-10 font-display text-[clamp(1.6rem,4.2vw,4.25rem)] font-medium uppercase leading-[0.95] tracking-[-0.045em] transition-transform duration-700 ease-expo group-hover:translate-x-4 md:col-span-6">
              {work.title}
            </span>
            <span className="col-span-6 col-start-3 text-[11px] uppercase tracking-[0.2em] text-paper/50 md:col-span-3 md:col-start-auto">
              {work.category}
            </span>
            <span className="col-span-4 flex items-center justify-end gap-3 text-sm text-paper/50 md:col-span-2">
              <span className="hidden lg:inline">{work.format}</span>
              <ArrowUpRight size={18} className="text-paper/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-ember" />
            </span>
          </Link>
        </motion.div>
      ))}

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block"
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl transition-[scale,opacity] duration-500 ease-expo ${
            active !== null ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="relative h-[17rem] w-[24rem] overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 transition-transform duration-700 ease-expo"
              style={{ transform: `translateY(-${(active ?? 0) * 17}rem)` }}
            >
              {items.map((w) => (
                <img
                  key={w.id}
                  src={w.poster}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-[17rem] w-[24rem] object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */

export default function Work() {
  const [filter, setFilter] = useState('All')
  const [view, setView] = useState('grid')
  const delay = introDelay()

  const items = useMemo(() => (filter === 'All' ? works : works.filter((w) => w.tags.includes(filter))), [filter])

  return (
    <Page title="Work" label="Work">
      <section className="px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
        <div className="mx-auto max-w-[1680px]">
          <Eyebrow index="W">Selected output</Eyebrow>
          <div className="mt-8 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <Lines
              as="h1"
              trigger="load"
              delay={delay}
              className="font-display text-[clamp(4rem,15vw,16rem)] font-medium uppercase leading-[0.82] tracking-[-0.07em]"
            >
              <span className="flex items-start">
                Work
                <sup className="ml-3 mt-[0.6em] font-sans text-[clamp(0.9rem,1.6vw,1.5rem)] font-normal tracking-normal text-ember">
                  ({String(works.length).padStart(2, '0')})
                </sup>
              </span>
              <span>
                that <Serif className="normal-case text-ember">moves</Serif>
              </span>
            </Lines>
            <Words
              trigger="load"
              delay={delay + 0.3}
              className="max-w-md text-[15px] leading-relaxed text-paper/55"
              text="Cinematic visual creative, high-retention motion and performance video — engineered to turn attention into revenue. Hover a project to preview it."
            />
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-y border-paper/10 bg-ink/80 px-5 py-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`relative shrink-0 rounded-full px-4 py-2 text-[12px] font-medium transition-colors duration-300 ${
                  filter === f ? 'text-ink' : 'text-paper/60 hover:text-paper'
                }`}
              >
                {filter === f ? (
                  <motion.span layoutId="work-filter" className="absolute inset-0 rounded-full bg-ember" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                ) : null}
                <span className="relative">
                  {f === 'All' ? 'All' : titleCase(f)}
                  <span className="ml-1.5 opacity-50">
                    {f === 'All' ? works.length : works.filter((w) => w.tags.includes(f)).length}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-full border border-paper/15 p-1" role="group" aria-label="Layout">
            {[
              { id: 'grid', icon: LayoutGrid, label: 'Grid view' },
              { id: 'list', icon: Rows3, label: 'List view' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-pressed={view === id}
                aria-label={label}
                className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                  view === id ? 'bg-paper text-ink' : 'text-paper/60 hover:text-paper'
                }`}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1680px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === 'grid' ? <GridView items={items} /> : <ListView items={items} />}
            </motion.div>
          </AnimatePresence>
          {items.length === 0 ? <p className="py-20 text-center text-paper/50">No projects in this category yet.</p> : null}
        </div>
      </section>

      <Marquee
        items={['Your brand could be next', 'AI UGC', 'Motion', 'Editing', 'Web']}
        className="border-t border-paper/10 py-8 font-display text-[clamp(2.5rem,7vw,6rem)] font-medium uppercase tracking-[-0.05em] text-paper/15"
        reverse
        duration={45}
      />
    </Page>
  )
}
