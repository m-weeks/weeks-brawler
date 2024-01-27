import _ from 'lodash';
import { Canvas } from '@react-three/fiber';
import Map from './components/Map'
import CameraControls from './components/CameraControls';
import Avatar from './components/Avatar';
import FirstPersonWeapon from './components/FirstPersonWeapon';
import ServerConnection from './util/ServerConnection';

function App() {
  return (
    <div style={{ position: 'relative' }}>
      <ServerConnection>
        {
          (({ gameState, localState, updatePlayer }) => (
            <>
              <Canvas style={{ width: '100vw', height: '100vh' }}>
                <CameraControls myPlayer={localState.myPlayer} updatePlayer={updatePlayer} />
                <ambientLight intensity={2} />
                <Map />
                {
                  _.map(gameState.players, (player, playerId) => {
                    if (playerId === localState.clientId) {
                      return null;
                    }
                    return (
                      <Avatar
                        key={playerId}
                        player={player}
                        myPlayer={localState.myPlayer}
                      />
                    );
                  })
                }
              </Canvas>
              <FirstPersonWeapon updatePlayer={updatePlayer} />
            </>
          ))
        }
      </ServerConnection>
    </div>
  );
}

export default App
