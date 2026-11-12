import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

/**
 * Video.js player with responsive sizing and the ARK theme.
 * Callbacks are kept in refs so parent re-renders never reset playback.
 */
export default function VideoJSPlayer({ options, onReady, onError, className = '' }) {
  const videoNodeRef = useRef(null)
  const playerRef = useRef(null)
  const onReadyRef = useRef(onReady)
  const onErrorRef = useRef(onError)
  onReadyRef.current = onReady
  onErrorRef.current = onError

  useEffect(() => {
    if (!playerRef.current && videoNodeRef.current) {
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered', 'ark-video-js', 'vjs-fill')
      videoElement.setAttribute('playsinline', 'true')
      videoNodeRef.current.appendChild(videoElement)

      const player = videojs(videoElement, options, () => onReadyRef.current?.(player))
      player.on('error', () => onErrorRef.current?.(player.error()))
      playerRef.current = player
    } else if (playerRef.current) {
      const player = playerRef.current
      if (options.autoplay !== undefined) player.autoplay(options.autoplay)
      if (options.sources) player.src(options.sources)
      if (options.poster) player.poster(options.poster)
    }
  }, [options])

  useEffect(() => {
    const node = videoNodeRef.current
    return () => {
      const player = playerRef.current
      if (player && !player.isDisposed()) player.dispose()
      playerRef.current = null
      if (node) node.innerHTML = ''
    }
  }, [])

  return (
    <div data-vjs-player className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-black ${className}`}>
      <div ref={videoNodeRef} className="flex h-full w-full items-center justify-center" />
    </div>
  )
}
