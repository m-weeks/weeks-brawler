import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, SpriteMaterial, Sprite } from 'three';
import avatars from './assets/avatars';
import death from './assets/death.png';

const Avatar = ({ player, myPlayer }) => {
  const { angle, punching, moving, iFrame, playerModelId } = player;
  const dead = player.health <= 0;

  const curAvatar = avatars[playerModelId];
  const avatarRef = useRef(curAvatar);
  avatarRef.current = curAvatar;
  
  const punchTypeRef = useRef(curAvatar.front.punch[0])
  useEffect(() => {
    if (punching) {
      punchTypeRef.current = Math.random() < 0.5 ? avatarRef.current.front.punch[0] : avatarRef.current.front.punch[1];
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
    const avatar = avatarRef.current;
    if (dead) {
      return death;
    }
    let diff = (myPlayer.angle - angle) * (180 / Math.PI);
    diff = (diff +  360) % 360;
    if (diff > 45 && diff < 135) {
      if (punching) {
        return avatar.right.punch;
      }
      if (moving) { 
        return avatar.right.step[stepFrame - 1];
      }
      return avatar.right.idle;
    }
    if (diff > 135 && diff < 225) {
      if (punching) {
        return punchTypeRef.current;
      }
      if (moving) {
        return avatar.front.step[stepFrame - 1];
      }
      if (iFrame) {
        return avatar.front.hit;
      }
      return avatar.front.idle;
    }
    if (diff > 225 && diff < 315) {
      if (punching) {
        return avatar.left.punch;
      }
      if (moving) { 
        return avatar.left.step[stepFrame - 1];
      }
      return avatar.left.idle;
    }
    if (moving) {
      return avatar.behind.step[stepFrame - 1];
    }
    return avatar.behind.idle;
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

  const texture = useLoader(TextureLoader, avatarType);
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