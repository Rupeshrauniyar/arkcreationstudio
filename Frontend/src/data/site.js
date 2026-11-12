import { Film, Sparkles, Zap, Code2 } from 'lucide-react'

export const EMAIL = 'arkcreationstudio@gmail.com'
export const INSTAGRAM = 'https://www.instagram.com/arkcreationstudio/'

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'Studio' },
  { to: '/contact', label: 'Contact' },
]

export const services = [
  {
    n: '01',
    slug: 'video-editing',
    icon: Film,
    title: 'Video Editing',
    short: 'Short-form, long-form, ads, launch films and social cuts shaped around retention, rhythm and brand intent.',
    detail:
      'From raw footage to scroll-stopping content. We handle short-form social cuts, long-form brand films, product launch videos and performance ad creative. Every edit is engineered around retention curves, pacing and brand consistency — we don’t just cut, we build narratives that hold attention and drive action.',
    deliverables: ['Social media cuts', 'Brand films', 'Product videos', 'Launch campaigns', 'Ad creative', 'YouTube content'],
    idealFor: ['Brands launching products', 'Creators scaling output', 'Teams with footage but no editor'],
  },
  {
    n: '02',
    slug: 'motion-graphics',
    icon: Sparkles,
    title: 'Motion Graphics',
    short: 'Kinetic typography, product motion, transitions and visual systems that make a brand feel alive.',
    detail:
      'Motion is where static brands become living experiences. We design kinetic typography, animated logos, product reveal sequences, title cards, lower thirds and complete motion systems. Whether it’s a three-second transition or a full broadcast package, every frame is designed to feel premium.',
    deliverables: ['Kinetic typography', 'Logo animation', 'Product motion', 'Title sequences', 'Broadcast packages', 'Social animations'],
    idealFor: ['Brand refreshes', 'Product explainers', 'Channels that need a visual identity'],
  },
  {
    n: '03',
    slug: 'ai-ugc-ads',
    icon: Zap,
    title: 'AI UGC Ads',
    short: 'Fast, scalable creative with scripts, hooks, avatars, product demos and multiple variations built for testing.',
    detail:
      'AI-powered user-generated content at scale. We produce realistic AI avatar ads, podcast-style commercials, product demos and hook variations — all optimised for paid social. Scripts are written for conversion, visuals are built for thumb-stopping impact, and every asset is delivered ready to test.',
    deliverables: ['AI avatar ads', 'Podcast commercials', 'Product demos', 'Hook variations', 'Script writing', 'A/B test assets'],
    idealFor: ['Performance marketers', 'DTC brands testing creative', 'Campaigns on tight deadlines'],
  },
  {
    n: '04',
    slug: 'web-digital',
    icon: Code2,
    title: 'Web + Digital',
    short: 'High-impact websites and landing pages combining sharp UX, motion, responsive front ends and 3D.',
    detail:
      'We build websites that feel as good as they look. High-performance landing pages, portfolio sites, brand microsites and interactive digital experiences — built on modern stacks with smooth animation, responsive design and, when it earns its place, a touch of 3D.',
    deliverables: ['Landing pages', 'Portfolio sites', 'Brand microsites', 'Interactive experiences', '3D web', 'Responsive design'],
    idealFor: ['Launches that need a home', 'Studios & creators', 'Brands outgrowing templates'],
  },
]

export const process = [
  {
    n: '01',
    title: 'Brief',
    copy: 'You tell us what needs to move. We dig into the goal, the audience, the platform and the deadline — then lock a clear scope.',
    points: ['Goals & audience', 'References & tone', 'Scope & timeline'],
  },
  {
    n: '02',
    title: 'Build',
    copy: 'We cut, animate, generate and design. You get early direction checks so nothing drifts away from the brief.',
    points: ['Script & structure', 'First cut or prototype', 'Direction check-in'],
  },
  {
    n: '03',
    title: 'Refine',
    copy: 'Fast feedback rounds and focused revisions. We refine until the final version feels right — not just finished.',
    points: ['Timestamped feedback', 'Focused revisions', 'Polish & finishing'],
  },
  {
    n: '04',
    title: 'Ship',
    copy: 'Final files ready for launch, ads or social — exported in every format and ratio you need.',
    points: ['Platform-ready exports', 'Variations & cutdowns', 'Handover & source'],
  },
]

export const values = [
  { n: '01', title: 'Fast', copy: 'Tight turnaround without cutting corners. We work around the campaign clock — some projects ship within a day.' },
  { n: '02', title: 'Flex', copy: 'Revisions are part of the process. We refine until the final version feels right.' },
  { n: '03', title: 'Smart', copy: 'Lean pricing means more of your budget goes into the actual creative — no agency overhead.' },
  { n: '04', title: 'Sharp', copy: 'Premium craft across editing, motion, AI creative and digital execution.' },
]

export const engagements = [
  {
    title: 'Single project',
    copy: 'One clear deliverable — an ad, a film, a site. Scoped up front, delivered fast.',
    points: ['Fixed scope', 'Clear timeline', 'Revisions included'],
  },
  {
    title: 'Creative sprint',
    copy: 'A focused burst of output for a launch or campaign: multiple assets, variations and formats.',
    points: ['Batch production', 'Hook & format variations', 'Priority turnaround'],
    featured: true,
  },
  {
    title: 'Ongoing partner',
    copy: 'A creative team on call. Recurring content, edits and updates without hiring in-house.',
    points: ['Monthly capacity', 'Consistent brand voice', 'One point of contact'],
  },
]

export const faqs = [
  {
    q: 'What kind of projects do you take on?',
    a: 'Video editing, motion graphics, AI UGC ads and web/digital projects — from short social cuts to full brand films, product launch campaigns to interactive websites.',
  },
  {
    q: 'What’s your typical turnaround time?',
    a: 'It depends on scope. Short-form and AI UGC work can move very fast — some projects have been delivered within a day. Larger productions are scoped with a clear timeline up front.',
  },
  {
    q: 'How does pricing work?',
    a: 'Lean and transparent. Each project is scoped individually based on complexity and deliverables, with no bloated retainers or hidden fees.',
  },
  {
    q: 'How do revisions work?',
    a: 'Revisions are part of the process. You share timestamped feedback, we refine — until the final version feels right.',
  },
  {
    q: 'Where are you based?',
    a: 'ARK is built in Nepal and works with brands, creators and teams worldwide, collaborating asynchronously across time zones.',
  },
]

export const stats = [
  { value: 4, suffix: '', label: 'Disciplines under one roof' },
  { value: 24, suffix: 'h', label: 'Fastest turnaround delivered' },
  { value: 24, suffix: '/7', label: 'Async collaboration, any time zone' },
  { value: 1, suffix: '', label: 'Point of contact, concept to delivery' },
]

