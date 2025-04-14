import React, { useRef } from 'react' // Import useRef
import Planet from './Planet'
import { OrbitControls, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber' // Import useFrame

function SolarSystem() {
    const handlePlanetClick = (planetName) => {
        console.log(`${planetName} clicked!`)
        // Add logic here to display planet info or navigate
    }

    // Load the sun texture
    const sunTexture = useTexture('/textures/sun.jpg'); // Adjust filename/path if needed
    const sunRef = useRef(); // Ref for the sun mesh

    // Rotate the sun slowly
    useFrame(() => {
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.0005; // Adjust speed as needed
        }
    });

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            {/* Point light simulates a sun - keep it for lighting effect */}
            <pointLight position={[0, 0, 0]} intensity={1.5} color="white" /> {/* Changed color to white for more natural light */}

            {/* Visual representation for the center/sun with texture */}
            <mesh position={[0, 0, 0]} ref={sunRef}> {/* Add ref here */}
                <sphereGeometry args={[1.5, 32, 32]} />
                {/* Apply texture and make it emissive */}
                <meshStandardMaterial
                    map={sunTexture}
                    emissiveMap={sunTexture} // Make texture glow
                    emissive={0xffffff} // Glow color (white)
                    emissiveIntensity={1.2} // Adjust glow intensity
                />
            </mesh>

            {/* Planets */}
            <Planet
                textureUrl="/textures/mars.webp"
                size={0.8} // Slightly smaller Mars
                orbitRadius={5}
                initialAngle={0}
                orbitSpeed={0.3}
                onClick={() => handlePlanetClick('Mars')}
            />
            <Planet
                textureUrl="/textures/jupiter.jpg" // Use Jupiter texture
                size={1.8} // Make Jupiter larger
                orbitRadius={12} // Increase orbit radius
                initialAngle={Math.PI / 1.5} // Adjust starting angle if needed
                orbitSpeed={0.15} // Slower orbit for outer planet
                rotationSpeed={0.015} // Add and adjust Jupiter's rotation speed
                onClick={() => handlePlanetClick('Jupiter')} // Update name
            />

            {/* Optional: Camera controls for development */}
            {/* <OrbitControls enableZoom={true} enablePan={true} /> */}
        </>
    )
}

export default SolarSystem
