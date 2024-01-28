import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { mapData } from './Map';
import { Vector3 } from 'three'

const usePunch = ({ localState, gameState, sendMessage }) => {
  const { myPlayer } = localState;
  const { punching } = myPlayer;

  const {
    camera,
  } = useThree();

  const otherPlayers = _.compact(
    _.map(gameState.players, (player, playerId) => {
      if (playerId === localState.clientId) {
        return null;
      }
      return  {
        ...player,
        clientId: playerId
      };
    })
  )
  const otherPlayersRef = useRef(otherPlayers);
  otherPlayersRef.current = otherPlayers;

  useEffect(() => {
    if (!punching) return;

    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);

    otherPlayersRef.current.forEach(player => {
      const directionToPlayer = new Vector3().subVectors(
        new Vector3(player.x, 0, player.z),
        camera.position
      ).normalize();
      const angle = cameraDirection.angleTo(directionToPlayer);

      const distanceToPlayer = camera.position.distanceTo(new Vector3(player.x, 0, player.z));

      // If the angle is small enough, the player is in front of the camera
      if (angle < Math.PI / 4 && distanceToPlayer < 0.4) {
        sendMessage('PUNCH', { clientId: player.clientId })
      }
    });
    
  }, [punching, sendMessage])
  
}

export default function CameraControls({ localState, updatePlayer, gameState, sendMessage }) {
  const { myPlayer } = localState;
  const {
    camera,
  } = useThree();

  const originalPlayerRef = useRef(myPlayer);

  useEffect(() => {
    camera.position.x = originalPlayerRef.current.x;
    camera.position.z = originalPlayerRef.current.z;
    camera.position.y = 0.15;
    camera.rotation.y = originalPlayerRef.current.angle;
  }, []);

  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const rotateLeft = useRef(false);
  const rotateRight = useRef(false);

  const speed = 2;
  const rotationSpeed = 0.04;

  const handleKeyDown = (event) => {
    switch (event.code) {
      case 'KeyW':
        moveForward.current = true;
        break;
      case 'KeyS':
        moveBackward.current = true;
        break;
      case 'KeyA':
        rotateLeft.current = true;
        break;
      case 'KeyD':
        rotateRight.current = true;
        break;
      case 'KeyQ':
        moveLeft.current = true;
        break;
      case 'KeyE':
        moveRight.current = true;
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.code) {
      case 'KeyW':
        moveForward.current = false;
        break;
      case 'KeyS':
        moveBackward.current = false;
        break;
      case 'KeyA':
        rotateLeft.current = false;
        break;
      case 'KeyD':
        rotateRight.current = false;
        break;
      case 'KeyQ':
        moveLeft.current = false;
        break;
      case 'KeyE':
        moveRight.current = false;
        break;
      default:
        break;
    }
  };

  const checkCollision = (newPosition) => {
    const buffer = 0.2;

    // Check the area around the camera, including the buffer
    for (let x = Math.round(newPosition.x - buffer); x <= Math.round(newPosition.x + buffer); x++) {
      for (let z = Math.round(newPosition.z - buffer); z <= Math.round(newPosition.z + buffer); z++) {
        // Check if the grid position is within the map bounds
        if (x < 0 || x >= mapData.length || z < 0 || z >= mapData[0].length) {
          return true; // Collision detected (out of bounds)
        }

        // Check if the grid position is a wall
        if (mapData[x][z] === 1) {
          return true; // Collision detected (wall)
        }
      }
    }

    return false; // No collision
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_state, delta) => {
    const speedPerFrame = speed * delta;
    const forwardDirection = new Vector3();
    const rightDirection = new Vector3();
    camera.getWorldDirection(forwardDirection);
    rightDirection.copy(forwardDirection).applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
  
    // Calculate new positions
    const newPositionX = camera.position.x - forwardDirection.x * (moveBackward.current - moveForward.current) * speedPerFrame - rightDirection.x * (moveRight.current - moveLeft.current) * speedPerFrame;
    const newPositionZ = camera.position.z - forwardDirection.z * (moveBackward.current - moveForward.current) * speedPerFrame - rightDirection.z * (moveRight.current - moveLeft.current) * speedPerFrame;
  
    if (!checkCollision({ x: newPositionX, z: camera.position.z })) {
      camera.position.x = newPositionX;
    }
    if (!checkCollision({ x: camera.position.x, z: newPositionZ })) {
      camera.position.z = newPositionZ;
    }
  
    if (rotateLeft.current) {
      camera.rotation.y += rotationSpeed;
    }
    if (rotateRight.current) {
      camera.rotation.y -= rotationSpeed;
    }

    // Update local state copy to have new position. This will get synced with the server at a regular interval
    updatePlayer({
      x: camera.position.x,
      z: camera.position.z,
      angle: camera.rotation.y % (Math.PI * 2),
      moving: moveForward.current || moveBackward.current || moveLeft.current || moveRight.current,
    });
  });

  usePunch({ localState, gameState, sendMessage })

  return null;
}