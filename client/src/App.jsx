import { Canvas } from '@react-three/fiber';
import Map from './components/Map'
import CameraControls from './components/CameraControls';
import Avatar from './components/Avatar';
import FirstPersonWeapon from './components/FirstPersonWeapon';

function App() {
  return (
    <div style={{ position: 'relative' }}>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <CameraControls />
        <ambientLight intensity={2} />
        <Map />
        <Avatar position={[3, 0, 2]} />
      </Canvas>
      <FirstPersonWeapon />
    </div>
  );
}

export default App
