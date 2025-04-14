import React from 'react'
import Planet from './Planet'
import { OrbitControls } from '@react-three/drei' // Optional: For camera control during development

function SolarSystem() {
    const handlePlanetClick = (planetName) => {
        console.log(`${planetName} clicked!`)
        // Add logic here to display planet info or navigate
    }

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            {/* Point light simulates a sun */}
            <pointLight position={[0, 0, 0]} intensity={1.5} color="yellow" />
            {/* Optional: Add a visual representation for the center/sun */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial emissive="yellow" emissiveIntensity={2} />
            </mesh>

            {/* Planets */}
            <Planet
                textureUrl="/textures/planet1.jpg"
                size={1}
                orbitRadius={5}
                initialAngle={0}
                orbitSpeed={0.3}
                rotationSpeed={0.01}
                onClick={() => handlePlanetClick('Planet 1')}
            />
            <Planet
                textureUrl="/textures/planet2.jpg"
                size={0.8}
                orbitRadius={8}
                initialAngle={Math.PI / 2} // Start at a different position
                orbitSpeed={0.2}
                rotationSpeed={0.008}
                onClick={() => handlePlanetClick('Planet 2')}
            />

            {/* Optional: Camera controls for development */}
            {/* <OrbitControls enableZoom={true} enablePan={true} /> */}
        </>
    )
}

export default SolarSystem
