import React, { useRef, useEffect, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, useTexture } from '@react-three/drei'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import * as THREE from 'three'

gsap.registerPlugin(MotionPathPlugin);

// Temporary vector for target position calculation
const currentTargetPos = new THREE.Vector3();

const Satellite = forwardRef(({ targetPlanetRef, onArrival, isMoving }, ref) => {
    const satelliteMeshRef = useRef()
    const texture = useTexture('/textures/satelite.webp')

    useEffect(() => {
        // Check if ref is valid, target *ref* exists, and we should be moving
        if (ref?.current && targetPlanetRef?.current && isMoving) {
            const startPos = ref.current.position.clone();
            // Get the INITIAL end position from the target ref
            const initialEndPos = targetPlanetRef.current.getWorldPosition(new THREE.Vector3());

            // Calculate control point based on initial positions
            const midPoint = new THREE.Vector3().addVectors(startPos, initialEndPos).multiplyScalar(0.5);
            const direction = new THREE.Vector3().subVectors(initialEndPos, startPos);
            const perpendicular = new THREE.Vector3(-direction.z, direction.y + 1, direction.x).normalize().multiplyScalar(2);
            const controlPoint = new THREE.Vector3().addVectors(midPoint, perpendicular);

            // Animate towards the *initial* end position using motionPath
            gsap.to(ref.current.position, {
                duration: 3.5,
                ease: 'power1.inOut',
                motionPath: {
                    path: [startPos, controlPoint, initialEndPos], // Path uses initial positions
                    curviness: 1,
                },
                onUpdate: () => {
                    // Runs every frame of the animation
                    if (satelliteMeshRef.current && targetPlanetRef?.current) {
                        // Get the target's CURRENT world position
                        targetPlanetRef.current.getWorldPosition(currentTargetPos);
                        // Make the satellite mesh look at the CURRENT position
                        satelliteMeshRef.current.lookAt(currentTargetPos);
                    }
                },
                onComplete: () => {
                    if (onArrival) {
                        onArrival();
                    }
                }
            });
        } else if (ref?.current && !isMoving) {
            gsap.killTweensOf(ref.current.position);
        }
        // Depend on targetPlanetRef itself, not its .current property
    }, [targetPlanetRef, isMoving, ref, onArrival])

    useFrame(() => {
        if (satelliteMeshRef.current) {
            // Example: Gentle bobbing
            // satelliteMeshRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.01;
            // Example: Slow rotation
            // satelliteMeshRef.current.rotation.y += 0.005;
        }
    })

    return (
        <group ref={ref} position={[0, 1, 8]}>
            <mesh ref={satelliteMeshRef}>
                <Cylinder args={[0.1, 0.1, 0.5, 8]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial map={texture} roughness={0.5} metalness={0.5} />
                </Cylinder>
            </mesh>
        </group>
    )
});

export default Satellite
