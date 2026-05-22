"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

export function AIParticleBurst() {
  // Generate 8-12 particles with random trajectories
  const particles = useMemo(() => {
    const count = 8 + Math.floor(Math.random() * 5) // 8-12 particles
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const distance = 30 + Math.random() * 20
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 0.5,
        size: 3 + Math.random() * 3,
      }
    })
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary"
          style={{
            width: particle.size,
            height: particle.size,
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: [0, particle.x, particle.x * 1.2],
            y: [0, particle.y, particle.y * 1.2],
            opacity: [1, 0.8, 0],
            scale: [1, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
