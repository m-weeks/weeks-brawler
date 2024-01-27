import { Canvas } from '@react-three/fiber';
import Map from './components/Map'
import CameraControls from './components/CameraControls';

function App() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <CameraControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Map />
    </Canvas>
  );
}

export default App
