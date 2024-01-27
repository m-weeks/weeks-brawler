import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { mapData } from './Map';

export default function CameraControls() {
  const {
    camera,
  } = useThree();

  useEffect(() => {
    camera.position.x = 1;
    camera.position.z = 1;
    camera.rotation.y = Math.PI
  }, []);

  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const rotateLeft = useRef(false);
  const rotateRight = useRef(false);

  const speed = 0.03;
  const rotationSpeed = 0.02;

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
    // Calculate the potential new position based on current movement
    const delta = speed;

    const originalPosition = { x: camera.position.x, z: camera.position.z };

    // Forward and backward movement
    camera.translateZ((moveBackward.current - moveForward.current) * delta);

    // Left and right strafing movement
    camera.translateX((moveRight.current - moveLeft.current) * delta);

    // Check for collision
    if (checkCollision({ x: camera.position.x, z: camera.position.z })) {
      // If collision, revert to the original position
      camera.position.x = originalPosition.x;
      camera.position.z = originalPosition.z;
    }

    // Handle rotation
    if (rotateLeft.current) {
      camera.rotation.y += rotationSpeed;
    }
    if (rotateRight.current) {
      camera.rotation.y -= rotationSpeed;
    }
  });

  return null;
}