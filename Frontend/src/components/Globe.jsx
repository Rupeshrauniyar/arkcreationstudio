import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Points, PointMaterial } from '@react-three/drei'
import { CanvasBoundary } from './Scene'
import { useMotion } from '../lib/motion'

const R = 2.2

const latLon = (lat, lon, r = R) => {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)]
}

function GlobeMesh({ animate }) {
  const group = useRef(null)
  const pulse = useRef(null)

  const dots = useMemo(() => {
    // Even-ish distribution (fibonacci sphere)
    const n = 2200
    const arr = new Float32Array(n * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = golden * i
      arr[i * 3] = Math.cos(theta) * radius * R
      arr[i * 3 + 1] = y * R
      arr[i * 3 + 2] = Math.sin(theta) * radius * R
    }
    return arr
  }, [])

  const nepal = useMemo(() => latLon(28.2, 84.1, R * 1.01), [])

  useFrame((state, delta) => {
    if (group.current && animate) group.current.rotation.y += delta * 0.12
    if (pulse.current) {
      const s = 1 + (animate ? Math.sin(state.clock.elapsedTime * 3) * 0.35 : 0)
      pulse.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={group} rotation={[0.35, -1.2, 0]}>
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color="#0b0b0b" />
      </mesh>
      <mesh>
        <sphereGeometry args={[R, 24, 24]} />
        <meshBasicMaterial color="#ece8e1" wireframe transparent opacity={0.06} />
      </mesh>
      <Points positions={dots} stride={3}>
        <PointMaterial transparent color="#ece8e1" size={0.03} sizeAttenuation depthWrite={false} opacity={0.5} />
      </Points>
      <group position={nepal}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ff5b1f" />
        </mesh>
        <mesh ref={pulse}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshBasicMaterial color="#ff5b1f" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  )
}

export default function Globe({ className = '' }) {
  const { motion } = useMotion()
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

  return (
    <CanvasBoundary>
      <div className={className} data-cursor={fine ? 'Drag' : undefined}>
        <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true }} frameloop={motion ? 'always' : 'demand'}>
          <GlobeMesh animate={motion} />
          {fine ? <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} /> : null}
        </Canvas>
      </div>
    </CanvasBoundary>
  )
}

