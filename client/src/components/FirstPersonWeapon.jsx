import { useEffect, useRef, useState } from 'react'
import idleImage from './assets/fists/fists.png'
import leftPunchImage from './assets/fists/left-punch.png'
import rightPunchImage from './assets/fists/right-punch.png'

export default function FirstPersonWeapon({ updatePlayer }) {
  const [image, setImage] = useState(idleImage);
  const [punch, setPunch] = useState(false);

  const punchRef = useRef(punch);
  punchRef.current = punch;

  useEffect(() => {
    let timer;

    const handleKeyDown = (event) => {
      if (event.code === 'Space' && !punchRef.current) {
        setImage(Math.random() < 0.5 ? leftPunchImage : rightPunchImage);
        setPunch(true);
        timer = setTimeout(() => {
          setImage(idleImage);
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

  return (
    <img
      src={image}
      style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)'}}
    />
  )
}