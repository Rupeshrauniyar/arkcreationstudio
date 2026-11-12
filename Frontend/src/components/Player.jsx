import React, { useMemo, useState } from 'react'
import { AlertCircle, ExternalLink } from 'lucide-react'
import VideoJSPlayer from './VideoJSPlayer'

/**
 * Video.js player that walks through every available source
 * (optimised rendition → original file → provider embed) before
 * giving up, so one failing rendition never breaks playback.
 */
export default function Player({ work, autoplay = true, className = '' }) {
  const sources = work.sources || []
  const [attempt, setAttempt] = useState(0)

  const exhausted = attempt >= sources.length
  const useIframe = exhausted && Boolean(work.embed)

  const options = useMemo(
    () => ({
      autoplay,
      controls: true,
      preload: 'auto',
      playsinline: true,
      poster: work.poster,
      sources: sources[attempt] ? [sources[attempt]] : [],
      controlBar: { pictureInPictureToggle: true, volumePanel: { inline: false } },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [work.id, attempt, autoplay]
  )

  return (
    <div className={`relative h-full w-full bg-black ${className}`}>
      {!exhausted ? (
        <VideoJSPlayer key={`${work.id}-${attempt}`} options={options} onError={() => setAttempt((a) => a + 1)} className="h-full w-full" />
      ) : useIframe ? (
        <iframe
          title={work.title}
          src={work.embed}
          className="block h-full w-full border-0 bg-black"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
          <AlertCircle className="text-ember" size={28} />
          <p className="max-w-xs text-sm text-paper/70">This video couldn’t be played in your browser.</p>
          {work.original ? (
            <a href={work.original} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 text-[13px] hover:border-ember hover:text-ember">
              Open video file <ExternalLink size={13} />
            </a>
          ) : null}
        </div>
      )}
    </div>
  )
}
