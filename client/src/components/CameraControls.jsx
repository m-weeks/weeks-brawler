import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { mapData } from './Map';
import { Vector3 } from 'three'

export default function CameraControls() {
  const {
    camera,
  } = useThree();

  useEffect(() => {
    camera.position.x = 1;
    camera.position.z = 1;
    camera.position.y = 0.15;
    camera.rotation.y = Math.PI
  }, []);

  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const rotateLeft = useRef(false);
  const rotateRight = useRef(false);

  const speed = 0.03;
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

  useFrame(() => {
    const delta = speed;
    const forwardDirection = new Vector3();
    const rightDirection = new Vector3();
    camera.getWorldDirection(forwardDirection);
    rightDirection.copy(forwardDirection).applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
  
    // Calculate new positions
    const newPositionX = camera.position.x - forwardDirection.x * (moveBackward.current - moveForward.current) * delta - rightDirection.x * (moveRight.current - moveLeft.current) * delta;
    const newPositionZ = camera.position.z - forwardDirection.z * (moveBackward.current - moveForward.current) * delta - rightDirection.z * (moveRight.current - moveLeft.current) * delta;
  
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
  });

  return null;
}