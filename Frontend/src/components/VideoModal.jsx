import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Player from './Player'
import { lockScroll } from '../lib/motion'

export default function VideoModal({ work, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    lockScroll(true)
    const previous = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      data-lenis-prevent
      className="fixed inset-0 z-[400] flex flex-col bg-ink/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10 md:py-6">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-ember">{work.category}</p>
          <p className="truncate font-display text-lg tracking-[-0.02em] md:text-2xl">{work.title}</p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="group grid h-12 w-12 shrink-0 place-items-center rounded-full border border-paper/20 transition-colors hover:border-ember hover:bg-ember hover:text-ink"
          aria-label="Close video"
        >
          <X size={18} className="transition-transform duration-500 group-hover:rotate-90" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-6 md:px-10 md:pb-10">
        <motion.div
          className={`relative overflow-hidden rounded-xl bg-black shadow-[0_40px_120px_rgba(0,0,0,0.7)] ${
            work.orientation === 'vertical'
              ? 'h-full max-h-[82svh] max-w-full'
              : 'h-full max-h-[82svh] w-full max-w-[1500px]'
          }`}
          style={work.orientation === 'vertical' ? { aspectRatio: '9 / 16' } : undefined}
          initial={{ clipPath: 'inset(15% 15% 15% 15% round 24px)', scale: 0.95 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 12px)', scale: 1 }}
          exit={{ clipPath: 'inset(15% 15% 15% 15% round 24px)', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <Player work={work} />
        </motion.div>
      </div>
    </motion.div>
  )
}

