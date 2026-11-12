import React, { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { useMotion } from '../lib/motion'

const PALETTES = [
  ['255 91 31', '#2a0c02'],
  ['255 154 77', '#1f1205'],
  ['232 68 26', '#170705'],
  ['255 196 107', '#211405'],
]

/**
 * Designed cover art — shown while media loads, or if it fails.
 */
export function CoverArt({ work }) {
  const i = Math.max(0, (Number(work.number) - 1) % PALETTES.length)
  const [rgb, deep] = PALETTES[i]

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        containerType: 'inline-size',
        background: `radial-gradient(120% 90% at 15% 110%, rgb(${rgb} / 0.55), transparent 60%), radial-gradient(70% 60% at 90% 0%, rgb(${rgb} / 0.25), transparent 60%), linear-gradient(160deg, #171717 10%, ${deep})`,
      }}
    >
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgb(236_232_225)_1px,transparent_1px),linear-gradient(90deg,rgb(236_232_225)_1px,transparent_1px)] [background-size:48px_48px]" />
      <span
        className="text-outline absolute -bottom-[0.18em] right-[0.04em] font-display font-medium leading-none tracking-[-0.08em]"
        style={{ fontSize: '46cqw' }}
      >
        {work.number}
      </span>
    </div>
  )
}

/**
 * Image + hover-preview layer. Fills its parent.
 */
function MediaLayer({ work, hover, armed, eager, onVideoError, imgClassName = '' }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(!work.poster)
  const video = useRef(null)

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (hover) v.play().catch(() => {})
    else v.pause()
  }, [hover, armed])

  return (
    <>
      <CoverArt work={work} />
      {!failed ? (
        <img
          src={work.poster}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      ) : null}
      {armed ? (
        <video
          ref={video}
          src={work.preview}
          muted
          loop
          playsInline
          preload="auto"
          onError={onVideoError}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${hover ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : null}
    </>
  )
}

/**
 * Work media card. Vertical (9:16) work is presented inside a centred
 * frame over a blurred backdrop so nothing important gets cropped.
 */
export default function WorkMedia({ work, className = '', preview = true, eager = false, showMeta = true, fill = false }) {
  const { motion } = useMotion()
  const [hover, setHover] = useState(false)
  const [armed, setArmed] = useState(false)
  const [videoOk, setVideoOk] = useState(true)

  const canPreview = preview && motion && videoOk && Boolean(work.preview)
  const framed = work.orientation === 'vertical' && !fill

  const enter = (e) => {
    if (!canPreview || e.pointerType === 'touch') return
    setArmed(true)
    setHover(true)
  }

  const layerProps = { work, hover, armed: armed && videoOk, eager, onVideoError: () => setVideoOk(false) }

  return (
    <div className={`relative overflow-hidden bg-ink-3 ${className}`} onPointerEnter={enter} onPointerLeave={() => setHover(false)}>
      {framed ? (
        <>
          <div className="absolute inset-[-10%]">
            <CoverArt work={work} />
            {work.poster ? (
              <img src={work.poster} alt="" aria-hidden="true" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl" />
            ) : null}
          </div>
          <div className="absolute inset-0 bg-ink/35" />
          <div data-parallax-inner className="absolute inset-0 flex items-center justify-center py-[6%]">
            <div
              className="relative h-full max-w-[86%] overflow-hidden rounded-[clamp(0.75rem,1.6vw,1.5rem)] shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-paper/15 transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.03]"
              style={{ aspectRatio: '9 / 16' }}
            >
              <MediaLayer {...layerProps} />
            </div>
          </div>
        </>
      ) : (
        <div data-parallax-inner className="absolute inset-[-6%] transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.04]">
          <MediaLayer {...layerProps} />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />

      {showMeta ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[10px] uppercase tracking-[0.2em] text-paper/80 md:p-5">
          <span className="rounded-full bg-ink/55 px-3 py-1.5 backdrop-blur-xl">
            {work.discipline || work.category}
            {work.duration ? <span className="ml-2 text-paper/50">{work.duration}</span> : null}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink/55 text-paper backdrop-blur-xl transition-colors duration-500 group-hover:bg-ember group-hover:text-ink">
            <Play size={12} fill="currentColor" className="translate-x-px" />
          </span>
        </div>
      ) : null}
    </div>
  )
}
