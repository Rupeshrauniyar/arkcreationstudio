/* ------------------------------------------------------------------
   Media resolver
   Turns a single video URL into everything the site needs:
   optimised playback sources, a lightweight hover preview, posters
   and frame grabs. Supports Cloudinary, Bunny Stream and plain MP4s.
------------------------------------------------------------------- */

const VIDEO_EXT = /\.(mp4|mov|m4v|webm|mkv)$/i

/**
 * Cloudinary — https://res.cloudinary.com/<cloud>/video/upload/[transforms/]v123/<id>.mp4
 * Generates H.264 (plays everywhere, even if the upload is HEVC/MOV),
 * auto-quality, size-limited renditions on the fly.
 */
function cloudinary(url, { posterAt = '8p' } = {}) {
  const m = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload)\/([^?#]+)/i)
  if (!m) return null
  const [, base, rest] = m
  const segments = rest.split('/')
  const versionIndex = segments.findIndex((s) => /^v\d+$/.test(s))
  const publicPath = (versionIndex >= 0 ? segments.slice(versionIndex) : segments.slice(-1)).join('/').replace(VIDEO_EXT, '')
  const build = (transform, ext) => `${base}/${transform}/${publicPath}.${ext}`

  return {
    provider: 'cloudinary',
    original: url,
    sources: [
      { src: build('vc_h264,q_auto,w_1080,c_limit', 'mp4'), type: 'video/mp4' },
      { src: url, type: 'video/mp4' },
    ],
    preview: build('vc_h264,q_auto:low,w_540,c_limit,du_8,ac_none', 'mp4'),
    poster: build(`so_${posterAt},w_1080,c_limit,q_auto`, 'jpg'),
    thumbnail: build(`so_${posterAt},w_640,c_limit,q_auto`, 'jpg'),
    frame: (at, width = 480) => build(`so_${at},w_${width},c_limit,q_auto`, 'jpg'),
  }
}

/** Bunny Stream — https://vz-xxxx.b-cdn.net/<guid>/playlist.m3u8 (or a bare GUID) */
function bunny(url, { libraryId = '790057', pullZone = 'vz-78ef4f60-054.b-cdn.net' } = {}) {
  const guid = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
  const isBunny = /b-cdn\.net|mediadelivery\.net/i.test(url) || (guid && guid[0] === url.trim())
  if (!guid || !isBunny) return null
  const zone = url.match(/https?:\/\/([^/]+\.b-cdn\.net)\//i)?.[1] || pullZone
  const id = guid[0]
  const root = `https://${zone}/${id}`

  return {
    provider: 'bunny',
    original: url,
    sources: [
      { src: `${root}/playlist.m3u8`, type: 'application/x-mpegURL' },
      { src: `${root}/play_720p.mp4`, type: 'video/mp4' },
    ],
    preview: `${root}/play_360p.mp4`,
    poster: `${root}/thumbnail.jpg`,
    thumbnail: `${root}/thumbnail.jpg`,
    embed: `https://player.mediadelivery.net/embed/${libraryId}/${id}?autoplay=true`,
    frame: () => `${root}/thumbnail.jpg`,
  }
}

/** Any other public video URL */
function generic(url, { poster } = {}) {
  return {
    provider: 'file',
    original: url,
    sources: [{ src: url, type: url.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4' }],
    preview: url.includes('.m3u8') ? null : url,
    poster: poster || null,
    thumbnail: poster || null,
    frame: () => poster || null,
  }
}

export function resolveMedia(url, options = {}) {
  return cloudinary(url, options) || bunny(url, options) || generic(url, options)
}

/* ------------------------------------------------------------------
   Work factory
------------------------------------------------------------------- */

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const ASPECTS = { '9:16': 9 / 16, '4:5': 4 / 5, '1:1': 1, '16:9': 16 / 9, '21:9': 21 / 9 }

/**
 * createWork(videoUrl, fields, index)
 * Only `title` and `category` are required in `fields` — everything
 * else (id, number, slug, tags, poster, preview, sources) is derived.
 */
export function createWork(videoUrl, fields, index) {
  const number = String(index + 1).padStart(2, '0')
  const aspect = fields.aspect || '16:9'
  const ratio = ASPECTS[aspect] || 16 / 9
  const media = resolveMedia(videoUrl, { posterAt: fields.posterAt, poster: fields.poster })
  const category = fields.category || ''

  return {
    id: `work-${number}`,
    number,
    slug: fields.slug || slugify(fields.title),
    aspect,
    ratio,
    orientation: ratio < 1 ? 'vertical' : ratio === 1 ? 'square' : 'landscape',
    tags: category.split('/').map((t) => t.trim()).filter(Boolean),
    deliverables: [],
    ...fields,
    ...media,
    poster: fields.poster || media.poster,
    thumbnail: fields.poster || media.thumbnail,
  }
}

