import { Canvas } from '@react-three/fiber';
import Map from './components/Map'
import CameraControls from './components/CameraControls';
import Avatar from './components/Avatar';

function App() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <CameraControls />
      <ambientLight intensity={2} />
      <Map />
      <Avatar position={[3, 0, 2]} />
    </Canvas>
  );
}

export default App
