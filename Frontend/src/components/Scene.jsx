import React, { Component, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useMotion } from '../lib/motion'

export class CanvasBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

function spherePoints(count, radius, jitter = 0.16) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * (1 - jitter / 2 + Math.random() * jitter)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi)
  }
  return arr
}

function ringPoints(count, radius, spread) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    const r = radius + (Math.random() - 0.5) * spread
    arr[i * 3] = Math.cos(a) * r
    arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.15
    arr[i * 3 + 2] = Math.sin(a) * r
  }
  return arr
}

function Ember({ animate }) {
  const group = useRef(null)
  const ring = useRef(null)
  const sphere = useMemo(() => spherePoints(3600, 2.3), [])
  const halo = useMemo(() => ringPoints(1800, 3.4, 0.9), [])
  const dust = useMemo(() => spherePoints(500, 5.5, 1.2), [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const targetX = state.pointer.y * 0.35
    const targetY = state.pointer.x * 0.55 + (animate ? t * 0.07 : 0)
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.035
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.035
    if (ring.current && animate) ring.current.rotation.y = -t * 0.12
  })

  return (
    <group ref={group}>
      <Points positions={sphere} stride={3}>
        <PointMaterial transparent color="#ff5b1f" size={0.024} sizeAttenuation depthWrite={false} />
      </Points>
      <group rotation={[1.15, 0.2, 0.35]}>
        <Points ref={ring} positions={halo} stride={3}>
          <PointMaterial transparent color="#ffb27a" size={0.014} sizeAttenuation depthWrite={false} opacity={0.8} />
        </Points>
      </group>
      <Points positions={dust} stride={3}>
        <PointMaterial transparent color="#ece8e1" size={0.012} sizeAttenuation depthWrite={false} opacity={0.35} />
      </Points>
    </group>
  )
}

export default function Scene({ className = '' }) {
  const { motion } = useMotion()
  const eventSource = typeof document !== 'undefined' ? document.getElementById('root') : undefined

  return (
    <CanvasBoundary>
      <div className={className} aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          eventSource={eventSource}
          eventPrefix="client"
          frameloop={motion ? 'always' : 'demand'}
        >
          <Ember animate={motion} />
        </Canvas>
      </div>
    </CanvasBoundary>
  )
}
