import React, { useEffect, useMemo, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, SpriteMaterial, Sprite } from 'three';
import idle from './assets/avatar/idle.png';
import punch1 from './assets/avatar/punch-1.png';
import punch2 from './assets/avatar/punch-2.png';
import leftIdle from './assets/avatar/left-idle.png';
import rightIdle from './assets/avatar/right-idle.png';
import leftPunch from './assets/avatar/left-punch.png';
import rightPunch from './assets/avatar/right-punch.png';
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


const Avatar = ({ player, myPlayer }) => {
  const { angle, punching } = player;

  const punchTypeRef = useRef('punch1')

  useEffect(() => {
    if (punching) {
      punchTypeRef.current = Math.random() < 0.5 ? 'punch1' : 'punch2';
    }
  }, [punching])

  const avatarType = useMemo(() => {
    let diff = (myPlayer.angle - angle) * (180 / Math.PI);
    diff = (diff +  360) % 360;
    if (diff > 45 && diff < 135) {
      return punching ? 'rightPunch' : 'rightIdle'
    }
    if (diff > 135 && diff < 225) {
      if (punching) {
        return punchTypeRef.current;
      }
      return 'idle';
    }
    if (diff > 225 && diff < 315) {
      return punching ? 'leftPunch' : 'leftIdle'
    }
    return 'behind';
  }, [angle, punching, myPlayer]);

  const texture = useLoader(TextureLoader, avatarImages[avatarType]);
  const material = useMemo(() => new SpriteMaterial({ map: texture, transparent: true }), [texture]);

  return (
    <sprite
      material={material}
      
      position={[
        player.x,
        0 - (0.1 / 2),
        player.z
      ]}
      scale={[0.75, 0.9, 0.75]}
    >
      <primitive object={new Sprite(material)} />
    </sprite>
  );
};

export default Avatar;