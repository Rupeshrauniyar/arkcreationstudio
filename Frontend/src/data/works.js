import { createWork } from './media'

/* ==================================================================
   PORTFOLIO
   ------------------------------------------------------------------
   HOW TO ADD A NEW PROJECT
   1. Upload the video to Cloudinary (any format — HEVC/MOV is fine,
      it's converted to H.264 automatically).
   2. Copy the delivery URL and add a new [url, { ... }] entry below.
   3. Order in this list = order on the site. Numbers (01, 02…), ids,
      URL slugs, posters, hover previews and optimised streams are all
      generated automatically.

   Required:  title, category ('DISCIPLINE / TYPE')
   Optional:  aspect ('9:16' | '4:5' | '1:1' | '16:9'), posterAt
              (frame for the cover, e.g. '5p' = 5% in, or '3' = 3s),
              client, discipline, format, duration, language,
              description, brief, approach, deliverables[], slug,
              poster (custom cover image URL)
   ================================================================== */

const projects = [
  [
    'https://res.cloudinary.com/dktnckmrj/video/upload/v1794505392/DCT_265.mp4',
    {
      title: 'Jointura / Joint Health Ad',
      category: 'UGC AD / PERFORMANCE',
      client: 'Jointura.in',
      discipline: 'UGC Ad',
      format: 'Vertical 9:16 · Reels & Shorts',
      duration: '0:37',
      language: 'Hinglish',
      aspect: '9:16',
      posterAt: '3p',
      description:
        'A scroll-stopping performance ad for a collagen joint-health supplement — opening on a reverse-psychology hook, then turning a presenter-led explainer into proof with lifestyle B-roll and 3D knee anatomy.',
      brief:
        'Sell an undenatured collagen type II capsule to an audience that has seen every joint-pain ad. It needed a hook strong enough to stop the thumb and an explanation simple enough to land in under 40 seconds.',
      approach:
        'We opened on a contrarian hook — “Don’t use this joint health capsule” — over the product, then cut fast between the presenter, relatable stair-climbing B-roll and a 3D knee visual showing cartilage wear. Word-by-word Hinglish captions keep it watchable on mute, and a real-life payoff closes the loop.',
      deliverables: ['Hook & script structure', 'Presenter edit & green-screen comps', '3D anatomy integration', 'Animated Hinglish captions', 'Vertical paid-social export'],
    },
  ],
  
  [
    'https://res.cloudinary.com/dktnckmrj/video/upload/v1794506630/1112_2.mp4',
    {
      title: 'Dadi’s Knees / Animated Story Ad',
      category: 'AI ANIMATION / STORYTELLING',
      discipline: 'AI Animation',
      format: 'Vertical 9:16 · Long-form',
      duration: '1:59',
      language: 'English',
      aspect: '9:16',
      posterAt: '3p',
      description:
        'A Pixar-style animated family story: a grandson notices his grandmother quietly saying no to family outings, goes looking for answers, and helps her get back on her feet — ending on a walk to the temple.',
      brief:
        'Make a joint-health product feel warm and human instead of clinical, and keep viewers watching for two minutes on a feed built for fifteen-second clips.',
      approach:
        'We told the story through a family the audience recognises — the grandmother, the grandson, the grandfather. Animated 3D characters carry the emotion, a mid-film 3D anatomy sequence explains how ingredients like hyaluronic acid support the joint, and the payoff lands as a moment rather than a pitch.',
      deliverables: ['Story & script', 'Animated character design', 'Scene generation & animation', '3D anatomy explainer', 'Captions, music & sound'],
    },
  ],
  [
    'https://res.cloudinary.com/dktnckmrj/video/upload/v1794507096/1112_2_1.mp4',
    {
      title: 'Skipping Surgery / Testimonial Ad',
      category: 'AI UGC / TESTIMONIAL',
      discipline: 'AI UGC',
      format: 'Vertical 9:16 · Long-form',
      duration: '3:29',
      language: 'English',
      aspect: '9:16',
      posterAt: '45p',
      description:
        'A first-person testimonial ad about deciding against knee surgery — a selfie-style confessional intercut with documentary-style B-roll, from sleepless nights and failed treatments to walking pain-free months later.',
      brief:
        'Earn trust with a sceptical, pain-weary audience who have already tried everything — and hold them for over three minutes.',
      approach:
        'We structured it like a real story: the surgery she skipped, the nights she couldn’t sleep, the treatments that didn’t work. A selfie-walk confessional keeps it intimate, the B-roll grounds every claim in a moment, and the ending — walking beside her husband — does the selling.',
      deliverables: ['Testimonial script', 'Character & performance', 'B-roll sourcing & edit', 'Story pacing', 'Captions & sound design'],
    },
  ],
  [
    'https://res.cloudinary.com/dktnckmrj/video/upload/v1794505392/1112_1.mp4',
    {
      title: 'The Teacher’s Story / AI UGC',
      category: 'AI UGC / STORYTELLING',
      discipline: 'AI UGC',
      format: 'Vertical 9:16 · Long-form',
      duration: '3:40',
      language: 'English',
      aspect: '9:16',
      posterAt: '2p',
      description:
        'A long-form, story-led AI UGC testimonial: a physics teacher’s personal journey through joint pain and surgery, told selfie-style and intercut with classroom scenes and 3D medical animation.',
      brief:
        'Hold attention for over three minutes — far beyond a typical ad — by making the viewer care about a person first and the product second.',
      approach:
        'We built a realistic AI character and a narrative arc: the classroom establishes who she is, the selfie-walk confessional builds trust, and 3D animation of the immune response inside the knee explains the problem before the product is ever introduced. Clean on-screen captions carry the story throughout.',
      deliverables: ['Story & script', 'AI character & scene generation', 'Selfie-style performance edit', '3D medical animation', 'Captions & sound design'],
    },
  ],
]

export const works = projects.map(([url, fields], index) => createWork(url, fields, index))

export const findWork = (slug) => works.find((w) => w.slug === slug || w.id === slug)
