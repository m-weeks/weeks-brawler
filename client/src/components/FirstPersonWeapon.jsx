import { useEffect, useRef, useState } from 'react'
import avatars from './assets/avatars';

export default function FirstPersonWeapon({ updatePlayer, localState, gameState }) {
  const avatar = avatars[5];
  const avatarRef = useRef(avatar);
  avatarRef.current = avatar;

  const [image, setImage] = useState(avatarRef.current.weapon.idle);
  const [punch, setPunch] = useState(false);

  const punchRef = useRef(punch);
  punchRef.current = punch;

  useEffect(() => {
    let timer;

    const handleKeyDown = (event) => {
      if (event.code === 'Space' && !punchRef.current) {
        setImage(Math.random() < 0.5 ? avatarRef.current.weapon.punch[0] : avatarRef.current.weapon.punch[1]);
        setPunch(true);
        timer = setTimeout(() => {
          setImage(avatarRef.current.weapon.idle);
          setPunch(false);
        }, 150);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer)
    };
  }, []);

  useEffect(() => {
    updatePlayer({ punching: punch })
  }, [punch])

  const myPlayer = gameState?.players?.[localState?.clientId];
  const { iFrame } = myPlayer ?? {}
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

  if (myPlayer?.health <= 0) {
    return null;
  }

  return (
    <>
      {/* Load images beforehand so they are ready for use (Otherwise they may not load in production) */}
      <div style={{ position: 'absolute', width: 0, height: 0, top: 0, left: 0, overflow: 'hidden'}}>
        <img src={avatarRef.current.weapon.punch[0]} />
        <img src={avatarRef.current.weapon.punch[0]} />
        <img src={avatarRef.current.weapon.idle} />
      </div>
      <img
        src={image}
        style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', opacity: opacity }}
      />
    </>
  )
}