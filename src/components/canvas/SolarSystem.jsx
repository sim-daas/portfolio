import React, { useRef } from 'react'
import Planet from './Planet'
import { OrbitControls, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

function SolarSystem() {
    const handlePlanetClick = (planetName) => {
        console.log(`${planetName} section clicked!`)
        // Later: Add logic to focus camera or display content for the clicked section
    }

    const sunTexture = useTexture('/textures/sun.jpg');
    const sunRef = useRef();

    // Rotate the sun slowly
    useFrame(() => {
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.0005;
        }
    });

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.4} /> {/* Slightly increased ambient light */}
            <pointLight position={[0, 0, 0]} intensity={1.5} color="white" />

            {/* Sun */}
            <mesh position={[0, 0, 0]} ref={sunRef}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshStandardMaterial
                    map={sunTexture}
                    emissiveMap={sunTexture}
                    emissive={0xffffff}
                    emissiveIntensity={1.2}
                />
            </mesh>

            {/* Portfolio Section Planets */}
            <Planet
                textureUrl="/textures/mars.webp" // Texture for About section
                size={1.0} // Example size
                orbitRadius={6} // Example orbit radius
                initialAngle={Math.PI / 4} // Example starting angle
                orbitSpeed={0.25} // Example orbit speed
                rotationSpeed={0.005} // Example rotation speed
                onClick={() => handlePlanetClick('About')}
            />
            <Planet
                textureUrl="/textures/jupiter.jpg" // Texture for Skills section
                size={1.2} // Example size
                orbitRadius={10} // Example orbit radius
                initialAngle={Math.PI * 1.5} // Example starting angle
                orbitSpeed={0.18} // Example orbit speed
                rotationSpeed={0.008} // Example rotation speed
                onClick={() => handlePlanetClick('Skills')}
            />

            {/* Optional: Camera controls for development */}
            {/* <OrbitControls enableZoom={true} enablePan={true} /> */}
        </>
    )
}

export default SolarSystem
