import React, { useRef, useState } from 'react'
import Planet from './Planet'
import Satellite from './Satellite'
import { OrbitControls, useTexture, Stars } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Temporary vector for calculations to avoid creating new objects in loop
const tempVector = new THREE.Vector3();
const tempTargetVector = new THREE.Vector3(); // Separate vector for target

function SolarSystem() {
    // Store the ref of the target planet, not just position
    const [targetPlanetRefState, setTargetPlanetRefState] = useState(null);
    const [isSatelliteMoving, setIsSatelliteMoving] = useState(false);

    const controlsRef = useRef(); // Ref for OrbitControls
    const satelliteRef = useRef(); // Ref for the Satellite's group

    const { camera } = useThree(); // Get camera instance

    const handlePlanetClick = (planetName, groupRef) => {
        console.log(`${planetName} section clicked!`);
        if (!isSatelliteMoving && groupRef.current) { // Only trigger if not already moving
            setTargetPlanetRefState(groupRef); // Store the ref itself
            setIsSatelliteMoving(true);
            if (controlsRef.current) {
                controlsRef.current.enabled = false; // Disable user controls during animation
            }
        }
    }

    const handleSatelliteArrival = () => {
        console.log("Satellite arrived!");
        setIsSatelliteMoving(false);
        // Don't clear targetPlanetRefState immediately, camera might still need it briefly
        if (controlsRef.current) {
            controlsRef.current.enabled = true; // Re-enable user controls
        }
        // Optional: Focus camera directly on planet after arrival
        if (targetPlanetRefState?.current && controlsRef.current) {
            targetPlanetRefState.current.getWorldPosition(tempTargetVector);
            controlsRef.current.target.copy(tempTargetVector); // Set target directly
        }
        // Clear target ref after a short delay or when next interaction starts
        setTimeout(() => setTargetPlanetRefState(null), 500);
    }

    const sunTexture = useTexture('/textures/sun.jpg');
    const sunRef = useRef();

    // Rotate the sun slowly
    useFrame(() => {
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.0005;
        }
    });

    // Camera tracking logic
    useFrame(() => {
        if (isSatelliteMoving && satelliteRef.current && controlsRef.current) {
            // Get satellite's current world position
            satelliteRef.current.getWorldPosition(tempVector);

            // Smoothly move the OrbitControls target towards the satellite
            controlsRef.current.target.lerp(tempVector, 0.05); // Adjust lerp factor (0.01 - 0.1) for smoothness

            controlsRef.current.update(); // IMPORTANT: Update controls after changing target
        } else if (targetPlanetRefState?.current && controlsRef.current && !isSatelliteMoving) {
            // If satellite arrived but we still have a target ref, keep focusing on planet
            targetPlanetRefState.current.getWorldPosition(tempTargetVector);
            controlsRef.current.target.lerp(tempTargetVector, 0.05); // Smoothly focus on planet
            controlsRef.current.update();
        } else if (controlsRef.current && !controlsRef.current.enabled && !isSatelliteMoving) {
            // Ensure controls are enabled if animation finished unexpectedly
            controlsRef.current.enabled = true;
        }
    });

    return (
        <>
            {/* 3D Starfield Background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Lighting */}
            <ambientLight intensity={0.4} /> {/* Slightly increased ambient light */}
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
                onClick={(groupRef) => handlePlanetClick('About', groupRef)}
                rotationSpeed={0.005} // Example rotation speed
                orbitSpeed={0.25} // Example orbit speed
                initialAngle={Math.PI / 4} // Example starting angle
                orbitRadius={6} // Example orbit radius
                size={1.0} // Example size
                textureUrl="/textures/mars.webp" // Texture for About section
            />
            <Planet
                onClick={(groupRef) => handlePlanetClick('Skills', groupRef)}
                rotationSpeed={0.008} // Example rotation speed
                orbitSpeed={0.18} // Example orbit speed
                initialAngle={Math.PI * 1.5} // Example starting angle
                orbitRadius={10} // Example orbit radius
                size={1.2} // Example size
                textureUrl="/textures/jupiter.jpg" // Texture for Skills section
            />

            {/* Satellite */}
            <Satellite
                isMoving={isSatelliteMoving} // Pass moving state
                onArrival={handleSatelliteArrival}
                targetPlanetRef={targetPlanetRefState} // Pass the target ref
                ref={satelliteRef} // Forward ref to the satellite's group
            />

            {/* Camera controls - Add ref */}
            <OrbitControls
                enableZoom={true}
                enablePan={true} // Allow panning
                minDistance={5} // Prevent zooming too close
                maxDistance={50} // Prevent zooming too far
                ref={controlsRef} // Add ref here
            />
        </>
    )
}

export default SolarSystem
