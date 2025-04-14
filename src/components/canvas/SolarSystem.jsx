import React, { useRef, useState } from 'react'
import Planet from './Planet'
import Satellite from './Satellite'
import { OrbitControls, useTexture, Stars } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const tempVector = new THREE.Vector3();
const desiredCameraPos = new THREE.Vector3(); // Vector for desired camera position

function SolarSystem() {
    const [targetPlanetRefState, setTargetPlanetRefState] = useState(null);
    const [targetPlanetSize, setTargetPlanetSize] = useState(1); // Store target size
    const [isSatelliteMoving, setIsSatelliteMoving] = useState(false);

    const controlsRef = useRef();
    const satelliteRef = useRef();
    const { camera } = useThree();

    const handlePlanetClick = (planetName, groupRef, planetSize) => {
        console.log(`${planetName} section clicked!`);

        // If clicking the currently tracked planet, reset the view
        if (targetPlanetRefState === groupRef) {
            setTargetPlanetRefState(null);
            setIsSatelliteMoving(false); // Ensure satellite stops if it was moving
            if (controlsRef.current) {
                controlsRef.current.enabled = true; // Re-enable controls
            }
            return; // Exit early
        }

        // If clicking a new planet (or first click)
        if (groupRef.current) {
            setTargetPlanetRefState(groupRef);
            setTargetPlanetSize(planetSize); // Store the size
            setIsSatelliteMoving(true); // Start satellite movement
        }
    }

    const handleSatelliteArrival = () => {
        console.log("Satellite arrived!");
        setIsSatelliteMoving(false); // Satellite stops, but camera continues tracking
    }

    const sunRef = useRef();
    const sunTexture = useTexture('/textures/sun.jpg');

    useFrame(() => {
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.0005;
        }
    });

    // Camera tracking logic - Enhanced for framing
    useFrame(() => {
        if (targetPlanetRefState?.current && controlsRef.current) {
            // --- Tracking Active ---
            controlsRef.current.enabled = false; // Ensure controls are disabled

            // Get planet's current world position
            targetPlanetRefState.current.getWorldPosition(tempVector);

            // Calculate desired camera position
            const distanceFactor = 3.5; // How many planet radii away the camera should be (adjust as needed)
            const cameraDistance = targetPlanetSize * distanceFactor;
            // Simple offset: position camera slightly behind and above the planet relative to the sun
            desiredCameraPos.copy(tempVector).normalize();
            // Add some vertical offset
            desiredCameraPos.y += 0.2; // Adjust vertical angle
            // Scale by desired distance and add to planet position
            desiredCameraPos.multiplyScalar(cameraDistance).add(tempVector);

            // Smoothly move camera position
            camera.position.lerp(desiredCameraPos, 0.04); // Adjust lerp factor for smoothness

            // Smoothly move OrbitControls target to the planet's center
            controlsRef.current.target.lerp(tempVector, 0.04); // Adjust lerp factor

            controlsRef.current.update(); // IMPORTANT: Update controls

        } else if (controlsRef.current && !controlsRef.current.enabled) {
            // --- Tracking Inactive ---
            // Only re-enable controls if not actively tracking
            controlsRef.current.enabled = true;
        }
    });

    return (
        <>
            <Stars radius={300} depth={100} count={5000} factor={5} saturation={0} fade speed={0.5} /> {/* Increased radius */}

            <ambientLight intensity={0.3} /> {/* Adjusted intensity slightly */}
            <pointLight position={[0, 0, 0]} intensity={1.8} color="white" distance={1000} decay={1} /> {/* Increased intensity and distance */}

            {/* Sun - Much larger */}
            <mesh position={[0, 0, 0]} ref={sunRef}>
                <sphereGeometry args={[8, 64, 64]} /> {/* Significantly larger sun */}
                <meshStandardMaterial
                    map={sunTexture}
                    emissiveMap={sunTexture}
                    emissive={0xffffff}
                    emissiveIntensity={1.5} // Slightly increased glow
                />
            </mesh>

            {/* Portfolio Section Planets - Pass size in onClick */}
            <Planet
                textureUrl="/textures/mars.webp" // About (Mars)
                size={1.5}
                orbitRadius={25}
                initialAngle={Math.PI / 4}
                orbitSpeed={0.08}
                rotationSpeed={0.01}
                onClick={(groupRef, size) => handlePlanetClick('About', groupRef, size)} // Pass size
            />
            <Planet
                textureUrl="/textures/jupiter.jpg" // Skills (Jupiter)
                size={4.5}
                orbitRadius={55}
                initialAngle={Math.PI * 1.5}
                orbitSpeed={0.04}
                rotationSpeed={0.008}
                onClick={(groupRef, size) => handlePlanetClick('Skills', groupRef, size)} // Pass size
            />

            {/* Satellite - No changes to its logic */}
            <Satellite
                ref={satelliteRef}
                targetPlanetRef={targetPlanetRefState}
                onArrival={handleSatelliteArrival}
                isMoving={isSatelliteMoving}
            />

            {/* Camera controls - Adjusted distances */}
            <OrbitControls
                ref={controlsRef}
                enableZoom={true}
                enablePan={true} // Keep panning enabled for user adjustment
                minDistance={10} // Increase min distance
                maxDistance={200} // Significantly increase max distance
                target={[0, 0, 0]} // Initial target at the center
            />
        </>
    )
}

export default SolarSystem
