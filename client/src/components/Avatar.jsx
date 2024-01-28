import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import step1 from './assets/avatar/step-1.png';
import step2 from './assets/avatar/step-2.png';
import stepLeft from './assets/avatar/step-left.png';
import stepRight from './assets/avatar/step-right.png';
import stepBehind1 from './assets/avatar/step-behind-1.png';
import stepBehind2 from './assets/avatar/step-behind-2.png';
import hit from './assets/avatar/hit.png';
import death from './assets/avatar/death.png'

const avatarImages = {
  idle,
  punch1,
  punch2,
  leftIdle,
  leftPunch,
  rightIdle,
  rightPunch,
  behind,
  step1,
  step2,
  stepLeft,
  stepRight,
  stepBehind1,
  stepBehind2,
  hit,
  death,
};

const Avatar = ({ player, myPlayer }) => {
  const { angle, punching, moving, iFrame } = player;
  const dead = player.health <= 0;
  
  const punchTypeRef = useRef('punch1')
  useEffect(() => {
    if (punching) {
      punchTypeRef.current = Math.random() < 0.5 ? 'punch1' : 'punch2';
    }
  }, [punching])

  const [stepFrame, setStepFrame] = useState(1);
  useEffect(() => {
    let interval;
    if (moving) {
      interval = setInterval(() => {
        setStepFrame((oldFrame) => oldFrame === 1 ? 2 : 1);
      }, 200)
    }

    return () => {
      clearInterval(interval);
    }
  }, [moving])

  const avatarType = useMemo(() => {
    if (dead) {
      return 'death';
    }
    let diff = (myPlayer.angle - angle) * (180 / Math.PI);
    diff = (diff +  360) % 360;
    if (diff > 45 && diff < 135) {
      if (punching) {
        return 'rightPunch'
      }
      if (moving && stepFrame === 1) { 
        return 'stepRight'
      }
      return 'rightIdle'
    }
    if (diff > 135 && diff < 225) {
      if (punching) {
        return punchTypeRef.current;
      }
      if (moving) {
        return stepFrame === 1 ? 'step1' : 'step2'
      }
      if (iFrame) {
        return 'hit';
      }
      return 'idle';
    }
    if (diff > 225 && diff < 315) {
      if (punching) {
        return 'leftPunch'
      }
      if (moving && stepFrame === 1) { 
        return 'stepLeft'
      }
      return 'leftIdle'
    }
    if (moving) {
      return stepFrame === 1 ? 'stepBehind1' : 'stepBehind2'
    }
    return 'behind';
  }, [angle, punching, myPlayer, stepFrame, moving, iFrame, dead]);

  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let interval;
    if (iFrame) {
      interval = setInterval(() => {
        setOpacity((oldOpacity) => oldOpacity === 1 ? 0 : 1);
      }, 50)
    }
    if (!iFrame) {
      setOpacity(1);
    }
    return () => {
      clearInterval(interval);
    }
  }, [iFrame])

  const texture = useLoader(TextureLoader, avatarImages[avatarType]);
  const material = new SpriteMaterial({ map: texture, opacity: opacity })

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