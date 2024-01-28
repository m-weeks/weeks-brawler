import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber";
import { AudioListener, AudioLoader, Audio, Vector3, PositionalAudio } from "three";
import deathSound from './assets/audio/death.ogg'
import hit1 from './assets/audio/hit-1.ogg';
import hit2 from './assets/audio/hit-2.ogg';
import hit3 from './assets/audio/hit-3.ogg';
import hit4 from './assets/audio/hit-4.ogg';
import punch1 from './assets/audio/punch-1.ogg';
import punch2 from './assets/audio/punch-2.ogg';
import punch3 from './assets/audio/punch-3.ogg';
import punch4 from './assets/audio/punch-4.ogg';

const hitNoises = [hit1, hit2, hit3, hit4];
const punchNoises = [punch1, punch2, punch3, punch4];

const PlayerNoises = ({ player, myPlayer }) => {
  const { health, punching } = player;

  const myPosition = useRef([myPlayer.x, 0, myPlayer.z]);
  myPosition.current = [myPlayer.x, 0, myPlayer.z];
  const playerPosition = useRef([player.x, 0, player.z]);
  playerPosition.current = [player.x, 0, player.z];

  const playSound = useRef((audioClip, scale = 0.5) => {
    const listener = new AudioListener();
    const audioLoader = new AudioLoader();
    const sound = new PositionalAudio(listener);
    
    const playerPos = new Vector3(...playerPosition.current);
    const myPos = new Vector3(...myPosition.current);
    const distance = playerPos.distanceTo(myPos);
    const volume = Math.min(1 / Math.pow(distance, 4), 1) * scale;

    console.log(volume)
    if (volume < 0.02) {
      return;
    }

    // Load a sound and set it as the Audio object's buffer
    audioLoader.load(audioClip, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(volume);
      sound.setDistanceModel('linear')
      sound.play();
    });
  })

  const previousHealthRef = useRef(health);
  useEffect(() => {
    const audioClip = (() => {
      if (health <= 0) {
        if (previousHealthRef.current !== 0) {
          return deathSound;
        }
      }
      if (health < previousHealthRef.current) {
        return hitNoises[Math.floor(Math.random() * hitNoises.length)];
      } 
    })()

    if (!audioClip) {
      return;
    }

    playSound.current(audioClip)

    previousHealthRef.current = health;
  }, [health]);

  useEffect(() => {
    if (punching) {
      playSound.current(punchNoises[Math.floor(Math.random() * hitNoises.length)], 1)
    }
  }, [punching])

  return null;
}

export default ({ gameState, localState }) => {
  const players = Object.values(gameState?.players)

  return (
    players.map((player, index) => (
      <PlayerNoises player={player} key={index} myPlayer={localState?.myPlayer} />
    ))
  )
}