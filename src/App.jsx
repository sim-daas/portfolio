import { Suspense } from 'react' // Import Suspense
import { Canvas } from '@react-three/fiber' // Import Canvas
import SolarSystem from './components/canvas/SolarSystem' // Import SolarSystem
import './App.css'

function App() {
  // State and logic for navigation/content will go here later

  return (
    // Replace the div with the Canvas component
    <Canvas camera={{ position: [0, 5, 15], fov: 75 }}> {/* Adjust camera position/fov as needed */}
      {/* Suspense is needed for components using async operations like texture loading */}
      <Suspense fallback={null}> {/* Wrap SolarSystem in Suspense */}
        <SolarSystem />
      </Suspense>
      {/* Add other non-3D UI elements outside the Canvas if needed, */}
      {/* or use Drei's <Html> component to embed HTML inside the Canvas */}
    </Canvas>
  )
}

export default App
