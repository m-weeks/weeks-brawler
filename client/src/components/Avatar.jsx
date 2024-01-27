import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, SpriteMaterial, Sprite } from 'three';
import idle from './assets/avatar/idle.png';
import punch1 from './assets/avatar/punch-1.png';
import punch2 from './assets/avatar/punch-2.png';
import leftIdle from './assets/avatar/left-idle.png';
import rightIdle from './assets/avatar/right-idle.png';
import leftPunch from './assets/avatar/left-punch.png';
import rightPunch from './assets/avatar/left-punch.png';
import behind from './assets/avatar/behind.png';

const avatarImages = {
  idle,
  punch1,
  punch2,
  leftIdle,
  leftPunch,
  rightIdle,
  rightPunch,
  behind
};


const Avatar = ({ position, angle, myPlayer }) => {
  const avatarType = useMemo(() => {
    let diff = (myPlayer.angle - angle) * (180 / Math.PI);
    diff = (diff +  360) % 360;
    if (diff > 45 && diff < 135) {
      return 'rightIdle';
    }
    if (diff > 135 && diff < 225) {
      return 'idle';
    }
    if (diff > 225 && diff < 315) {
      return 'leftIdle'
    }
    return 'behind';
  }, [angle, myPlayer]);

  const texture = useLoader(TextureLoader, avatarImages[avatarType]);
  const material = useMemo(() => new SpriteMaterial({ map: texture, transparent: true }), [texture]);

  return (
    <sprite
      material={material}
      position={[
        position[0],
        position[1] - (0.1 / 2),
        position[2]
      ]}
      scale={[0.75, 0.9, 0.75]}
    >
      <primitive object={new Sprite(material)} />
    </sprite>
  );
};

export default Avatar;