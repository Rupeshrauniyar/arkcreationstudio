import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { EMAIL, INSTAGRAM, navLinks } from '../data/site'
import { Magnetic, Marquee, RollText, Serif, useClock } from './ui'
import { gsap, scrollToTarget, useGsap } from '../lib/motion'
import { MotionToggle } from './Header'

export default function Footer({ cta = true }) {
  const time = useClock('Asia/Kathmandu', true)

  const scope = useGsap(() => {
    if (!cta) return
    gsap.from('[data-footer-word]', {
      yPercent: 100,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: '[data-footer-cta]', start: 'top 80%', once: true },
    })
  }, [cta])

  return (
    <footer ref={scope} className="relative overflow-hidden border-t border-paper/10 bg-ink-2">
      <div className="pointer-events-none absolute -bottom-[40%] left-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_91_31/0.18),transparent_60%)]" />

      {cta ? (
        <>
          <Marquee
            items={['Have a big idea', 'Start a project', 'Build. Move. Burn.', 'Let’s make it move']}
            className="border-b border-paper/10 py-5 font-display text-2xl uppercase tracking-[-0.02em] text-paper/40 md:text-4xl"
            duration={40}
          />

          <div data-footer-cta className="relative mx-auto max-w-[1680px] px-5 pb-16 pt-24 md:px-10 md:pt-36">
            <p className="mb-8 text-[11px] uppercase tracking-[0.22em] text-paper/45">
              <span className="text-ember">(Next)</span> — Got a project in mind?
            </p>
            <Link to="/contact" className="group relative block" data-cursor="Say hi">
              <span className="block overflow-hidden pb-[0.08em]">
                <span
                  data-footer-word
                  className="block whitespace-nowrap font-display text-[clamp(4.5rem,15vw,16rem)] font-medium uppercase leading-[0.95] tracking-[-0.065em]"
                >
                  Let’s{' '}
                  <Serif className="normal-case tracking-[-0.04em] text-ember transition-colors duration-500 group-hover:text-paper">talk</Serif>
                </span>
              </span>
              <span className="absolute right-0 top-1/2 hidden h-[clamp(6rem,9vw,9rem)] w-[clamp(6rem,9vw,9rem)] -translate-y-1/2 place-items-center rounded-full border border-paper/20 transition-all duration-700 ease-expo group-hover:rotate-45 group-hover:border-ember group-hover:bg-ember group-hover:text-ink lg:grid">
                <ArrowUpRight size={40} strokeWidth={1.25} />
              </span>
            </Link>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Magnetic>
                <Link
                  to="/contact"
                  className="group flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full bg-ember text-[12px] font-semibold uppercase tracking-[0.16em] text-ink transition-transform duration-700 ease-expo hover:scale-105 md:h-44 md:w-44"
                >
                  <ArrowUpRight size={26} className="transition-transform duration-500 group-hover:rotate-45" />
                  Start a project
                </Link>
              </Magnetic>
              <a href={`mailto:${EMAIL}`} className="link-line font-display text-xl tracking-[-0.02em] md:text-3xl">
                {EMAIL}
              </a>
            </div>
          </div>
        </>
      ) : null}

      <div className="relative mx-auto grid max-w-[1680px] gap-10 border-t border-paper/10 px-5 py-14 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-10 w-10 object-contain" />
            <span className="font-display text-lg font-semibold leading-tight tracking-[-0.02em]">
              ARK Creation
              <br />
              Studio
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/50">
            Independent creative + tech studio. Video, motion, AI creative and digital experiences built to make people look twice.
          </p>
        </div>

        <div>
          <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-paper/35">Sitemap</p>
          <ul className="space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-paper/75 transition-colors hover:text-ember">
                  <RollText>{l.label}</RollText>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-paper/35">Connect</p>
          <ul className="space-y-2.5">
            <li>
              <a href={`mailto:${EMAIL}`} className="text-paper/75 transition-colors hover:text-ember">
                <RollText>Email</RollText>
              </a>
            </li>
            <li>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-paper/75 transition-colors hover:text-ember">
                <RollText>Instagram</RollText>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-paper/35">Studio time</p>
            <p className="font-display text-3xl tabular-nums tracking-[-0.02em]">{time}</p>
            <p className="mt-1 text-sm text-paper/50">Kathmandu, Nepal — GMT+5:45</p>
          </div>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group inline-flex w-fit items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-paper/60 hover:text-paper"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-paper/20 transition-colors group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
              <ArrowUp size={15} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
            </span>
            Back to top
          </button>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-4 border-t border-paper/10 px-5 py-6 text-[11px] uppercase tracking-[0.18em] text-paper/35 md:px-10">
        <span>© {new Date().getFullYear()} ARK Creation Studio</span>
        <span>Build. Move. Burn.</span>
        <MotionToggle />
      </div>
    </footer>
  )
}

