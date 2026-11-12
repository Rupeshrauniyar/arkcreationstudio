import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Copy, Instagram, Mail, MapPin, Plus } from 'lucide-react'
import Page from '../components/Page'
import { Eyebrow, Lines, Magnetic, Reveal, Serif, Words, useClock } from '../components/ui'
import { introDelay } from '../lib/motion'
import { EMAIL, INSTAGRAM, faqs, services } from '../data/site'

const SERVICE_OPTIONS = [...services.map((s) => s.title), 'Not sure yet']
const BUDGETS = ['Under $1k', '$1k – $3k', '$3k – $10k', '$10k+', 'Let’s discuss']
const TIMELINES = ['ASAP', '2–4 weeks', '1–3 months', 'Flexible']

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[14px] transition-all duration-500 ease-expo ${
        active ? 'border-ember bg-ember text-ink' : 'border-paper/20 text-paper/75 hover:border-paper/60 hover:text-paper'
      }`}
    >
      <span className={`grid h-4 w-4 place-items-center rounded-full border transition-colors ${active ? 'border-ink bg-ink text-ember' : 'border-paper/30'}`}>
        {active ? <Check size={10} strokeWidth={3} /> : null}
      </span>
      {children}
    </button>
  )
}

function FieldGroup({ n, label, children }) {
  return (
    <Reveal className="border-t border-paper/10 py-10 md:py-12">
      <p className="mb-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-paper/45">
        <span className="text-ember">{n}</span> {label}
      </p>
      {children}
    </Reveal>
  )
}

/* ------------------------------------------------------------------
   Brief form — composes an email in the visitor’s mail app
------------------------------------------------------------------- */

function BriefForm() {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' })
  const [picked, setPicked] = useState([])
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [sent, setSent] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const toggle = (s) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  const submit = (e) => {
    e.preventDefault()
    const body = [
      `Hi ARK,`,
      ``,
      `Name: ${form.name}`,
      form.company ? `Company: ${form.company}` : null,
      `Email: ${form.email}`,
      picked.length ? `Interested in: ${picked.join(', ')}` : null,
      budget ? `Budget: ${budget}` : null,
      timeline ? `Timeline: ${timeline}` : null,
      ``,
      form.message,
    ]
      .filter((l) => l !== null)
      .join('\n')
    const subject = `Project brief — ${form.name}${form.company ? ` (${form.company})` : ''}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-ember/40 bg-ember/[0.06] p-8 md:p-14"
          role="status"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-ember text-ink">
            <Check size={28} />
          </span>
          <h3 className="mt-10 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-medium uppercase leading-[0.9] tracking-[-0.05em]">
            Brief <Serif className="normal-case text-ember">ready.</Serif>
          </h3>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-paper/65">
            Your email app should have opened with everything filled in — just hit send. If nothing opened, email us directly at{' '}
            <a href={`mailto:${EMAIL}`} className="link-line text-paper">
              {EMAIL}
            </a>
            .
          </p>
          <button type="button" onClick={() => setSent(false)} className="link-line mt-10 text-[11px] uppercase tracking-[0.2em] text-paper/60">
            Edit brief
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -20 }} className="border-b border-paper/10">
          <FieldGroup n="01" label="Introduce yourself">
            <div className="font-display text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.6] tracking-[-0.03em] text-paper/80">
              Hi ARK, my name is{' '}
              <input
                required
                value={form.name}
                onChange={update('name')}
                placeholder="your name"
                aria-label="Your name"
                autoComplete="name"
                className="field inline-block w-[min(100%,11ch)] px-1"
              />{' '}
              from{' '}
              <input
                value={form.company}
                onChange={update('company')}
                placeholder="company"
                aria-label="Company (optional)"
                autoComplete="organization"
                className="field inline-block w-[min(100%,10ch)] px-1"
              />
              . You can reach me at{' '}
              <input
                required
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="email@address.com"
                aria-label="Your email"
                autoComplete="email"
                className="field inline-block w-[min(100%,16ch)] px-1"
              />
              .
            </div>
          </FieldGroup>

          <FieldGroup n="02" label="I’m interested in">
            <div className="flex flex-wrap gap-2.5">
              {SERVICE_OPTIONS.map((s) => (
                <Pill key={s} active={picked.includes(s)} onClick={() => toggle(s)}>
                  {s}
                </Pill>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup n="03" label="Budget range">
            <div className="flex flex-wrap gap-2.5">
              {BUDGETS.map((b) => (
                <Pill key={b} active={budget === b} onClick={() => setBudget(budget === b ? '' : b)}>
                  {b}
                </Pill>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup n="04" label="Timeline">
            <div className="flex flex-wrap gap-2.5">
              {TIMELINES.map((t) => (
                <Pill key={t} active={timeline === t} onClick={() => setTimeline(timeline === t ? '' : t)}>
                  {t}
                </Pill>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup n="05" label="Tell us about the project">
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={update('message')}
              placeholder="What needs to move? Goals, references, deadlines…"
              aria-label="Project details"
              className="field w-full resize-none py-3 text-lg leading-relaxed md:text-xl"
            />
          </FieldGroup>

          <div className="flex flex-col items-start justify-between gap-8 border-t border-paper/10 py-12 sm:flex-row sm:items-center">
            <p className="max-w-xs text-sm leading-relaxed text-paper/45">
              Submitting opens your email app with this brief pre-filled. Nothing is stored on our side.
            </p>
            <Magnetic>
              <button
                type="submit"
                className="group flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full bg-ember text-[12px] font-semibold uppercase tracking-[0.16em] text-ink transition-transform duration-700 ease-expo hover:scale-105 md:h-40 md:w-40"
              >
                <ArrowUpRight size={26} className="transition-transform duration-500 group-hover:rotate-45" />
                Send brief
              </button>
            </Magnetic>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------
   Sidebar — direct contact
------------------------------------------------------------------- */

function DirectContact() {
  const [copied, setCopied] = useState(false)
  const time = useClock('Asia/Kathmandu', true)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <div className="lg:sticky lg:top-32">
      <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-paper/40">Prefer it direct?</p>

      <div className="overflow-hidden rounded-3xl border border-paper/10 bg-ink-2">
        <div className="border-b border-paper/10 p-6 md:p-8">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-paper/40">
            <Mail size={13} /> Email
          </p>
          <a href={`mailto:${EMAIL}`} className="link-line mt-4 block break-all font-display text-xl tracking-[-0.02em] md:text-2xl">
            {EMAIL}
          </a>
          <button
            type="button"
            onClick={copy}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-paper/15 px-4 py-2 text-[12px] text-paper/70 transition-colors hover:border-ember hover:text-paper"
            aria-live="polite"
          >
            {copied ? <Check size={13} className="text-ember" /> : <Copy size={13} />}
            {copied ? 'Copied to clipboard' : 'Copy address'}
          </button>
        </div>

        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between border-b border-paper/10 p-6 transition-colors hover:bg-ember hover:text-ink md:p-8"
        >
          <span>
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-paper/40 group-hover:text-ink/60">
              <Instagram size={13} /> Instagram
            </span>
            <span className="mt-3 block font-display text-xl tracking-[-0.02em]">@arkcreationstudio</span>
          </span>
          <ArrowUpRight size={22} className="transition-transform duration-500 group-hover:rotate-45" />
        </a>

        <div className="grid grid-cols-2">
          <div className="border-r border-paper/10 p-6 md:p-8">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-paper/40">
              <MapPin size={13} /> Based in
            </p>
            <p className="mt-3 font-display text-lg tracking-[-0.02em]">Nepal</p>
            <p className="text-sm text-paper/45">Working worldwide</p>
          </div>
          <div className="p-6 md:p-8">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-paper/40">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" /> Studio time
            </p>
            <p className="mt-3 font-display text-lg tabular-nums tracking-[-0.02em]">{time}</p>
            <p className="text-sm text-paper/45">GMT+5:45</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   FAQ accordion
------------------------------------------------------------------- */

function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="border-t border-paper/10 px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1680px] gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow index="02">Questions</Eyebrow>
          <Lines className="mt-6 font-display text-[clamp(2.75rem,6vw,6.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.06em]">
            <span>Good to</span>
            <span>
              <Serif className="normal-case text-ember">know.</Serif>
            </span>
          </Lines>
        </div>

        <div className="border-b border-paper/10 lg:col-span-7">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className="border-t border-paper/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-8"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="text-[11px] tracking-[0.2em] text-ember">0{i + 1}</span>
                    <span className="font-display text-xl tracking-[-0.02em] transition-colors group-hover:text-ember md:text-2xl">{f.q}</span>
                  </span>
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-expo ${
                      isOpen ? 'rotate-45 border-ember bg-ember text-ink' : 'border-paper/20'
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 pl-10 text-[15px] leading-relaxed text-paper/60">{f.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */

export default function Contact() {
  const delay = introDelay()

  return (
    <Page title="Contact" label="Contact" footerCta={false}>
      <section className="relative overflow-hidden px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
        <div className="orb pointer-events-none absolute -left-[20%] bottom-[-40%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(255_91_31/0.28),transparent_60%)] blur-3xl" />
        <div className="relative mx-auto max-w-[1680px]">
          <Eyebrow index="C">Start something</Eyebrow>
          <Lines
            as="h1"
            trigger="load"
            delay={delay}
            className="mt-8 font-display text-[clamp(3.75rem,14vw,15rem)] font-medium uppercase leading-[0.82] tracking-[-0.07em]"
          >
            <span>Have a</span>
            <span>
              <Serif className="normal-case text-ember">big</Serif> idea?
            </span>
          </Lines>
          <Words
            trigger="load"
            delay={delay + 0.3}
            className="mt-12 max-w-xl text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-paper/60"
            text="Tell us what you’re building. Fill in the brief below — it takes about a minute — or reach out directly."
          />
        </div>
      </section>

      <section className="px-5 pb-20 md:px-10">
        <div className="mx-auto grid max-w-[1680px] gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow index="01" className="mb-4">
              Project brief
            </Eyebrow>
            <BriefForm />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <DirectContact />
          </div>
        </div>
      </section>

      <Faq />
    </Page>
  )
}
