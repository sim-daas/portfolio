import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three' // Import animated components

function Planet({
  textureUrl,
  size = 1,
  orbitRadius = 5,
  initialAngle = 0,
  orbitSpeed = 0.5,
  onClick = () => { },
}) {
  const meshRef = useRef()
  const groupRef = useRef()
  const texture = useTexture(textureUrl)

  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  // Spring animation for scaling
  const { scale } = useSpring({
    scale: hovered || active ? 1.2 : 1, // Scale up if hovered or active
    config: { mass: 1, tension: 170, friction: 26 },
  })

  // Orbiting and Tidal Locking logic
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    const angle = initialAngle + elapsedTime * orbitSpeed
    const x = Math.cos(angle) * orbitRadius
    const z = Math.sin(angle) * orbitRadius

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z)
    }

    // Tidal Locking: Make the planet look at the center [0, 0, 0]
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0)
    }
  })

  const handlePointerOver = (event) => {
    event.stopPropagation() // Prevent event bubbling
    setHovered(true)
    document.body.style.cursor = 'pointer' // Change cursor on hover
  }

  const handlePointerOut = (event) => {
    event.stopPropagation()
    setHovered(false)
    if (!active) { // Only reset cursor if not active
      document.body.style.cursor = 'default'
    }
  }

  const handleClick = (event) => {
    event.stopPropagation()
    setActive(!active) // Toggle active state
    onClick() // Call the passed onClick handler
    // Keep cursor as pointer if active, otherwise default
    document.body.style.cursor = !active ? 'pointer' : 'default';
  }

  return (
    <group ref={groupRef}>
      <a.mesh
        ref={meshRef}
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.1}
        />
      </a.mesh>
    </group>
  )
}

export default Planet
