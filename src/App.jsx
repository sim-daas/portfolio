import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import SolarSystem from './components/canvas/SolarSystem'
import './App.css'

function App() {
  return (
    <Canvas camera={{ position: [0, 8, 18], fov: 65 }}> {/* Adjusted position and fov slightly */}
      <Suspense fallback={null}>
        <SolarSystem />
      </Suspense>
    </Canvas>
  )
}

export default App
