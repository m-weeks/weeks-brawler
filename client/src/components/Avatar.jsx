import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, SpriteMaterial, Sprite } from 'three';
import avatarImage from './assets/avatar.png';

const Avatar = ({ position }) => {
  const texture = useLoader(TextureLoader, avatarImage);
  const material = useMemo(() => new SpriteMaterial({ map: texture, transparent: true }), [texture]);

  return (
    <sprite material={material} position={position} scale={[1, 1, 1]}>
      <primitive object={new Sprite(material)} />
    </sprite>
  );
};

export default Avatar;