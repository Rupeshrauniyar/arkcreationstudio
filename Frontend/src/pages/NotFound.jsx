import React from 'react'
import Page from '../components/Page'
import { Lines, PillLink, Serif } from '../components/ui'
import { introDelay } from '../lib/motion'

export default function NotFound() {
  return (
    <Page title="Page not found" label="404" footerCta={false}>
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center gap-10 overflow-hidden px-5 text-center">
        <div className="orb pointer-events-none absolute h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_40%_38%,#ffca5b_0%,#ff5b1f_18%,#b62a00_38%,transparent_68%)] opacity-40 blur-3xl" />
        <p className="relative text-[11px] uppercase tracking-[0.22em] text-ember">(Error 404)</p>
        <Lines
          as="h1"
          trigger="load"
          delay={introDelay()}
          className="relative font-display text-[clamp(4rem,16vw,16rem)] font-medium uppercase leading-[0.82] tracking-[-0.07em]"
        >
          <span>Lost in</span>
          <span>
            the <Serif className="normal-case text-ember">scroll</Serif>
          </span>
        </Lines>
        <p className="relative max-w-sm text-paper/55">This page doesn’t exist — but plenty of good work does.</p>
        <div className="relative flex flex-wrap justify-center gap-3">
          <PillLink to="/">Back home</PillLink>
          <PillLink to="/work" variant="outline">
            See the work
          </PillLink>
        </div>
      </section>
    </Page>
  )
}

