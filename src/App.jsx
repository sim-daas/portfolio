import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import SolarSystem from './components/canvas/SolarSystem'
import './App.css'

function App() {
  return (
    <Canvas camera={{ position: [0, 20, 80], fov: 55 }}>
      <Suspense fallback={null}>
        <SolarSystem />
      </Suspense>
    </Canvas>
  )
}

export default App
