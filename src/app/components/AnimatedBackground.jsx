'use client'
import { useEffect } from 'react'

const AnimatedBackground = () => {
  useEffect(() => {
    const particlesContainer = document.querySelector('.particles')
    if (!particlesContainer) return

    // Clear existing particles
    particlesContainer.innerHTML = ''

    // Create new particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 6 + 's'
      particle.style.animationDuration = (Math.random() * 3 + 3) + 's'
      particlesContainer.appendChild(particle)
    }
  }, [])

  return <div className="particles"></div>
}

export default AnimatedBackground