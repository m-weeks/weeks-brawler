import frontIdle from './front-idle.png';
import frontPunch1 from './front-punch-1.png';
import frontPunch2 from './front-punch-2.png';
import leftIdle from './left-idle.png';
import rightIdle from './right-idle.png';
import leftPunch from './left-punch.png';
import rightPunch from './right-punch.png';
import behindIdle from './behind-idle.png';
import behindStep1 from './behind-step-1.png';
import behindStep2 from './behind-step-2.png';
import frontStep1 from './front-step-1.png';
import frontStep2 from './front-step-2.png';
import leftStep1 from './left-step-1.png';
import leftStep2 from './left-step-2.png';
import rightStep1 from './right-step-1.png';
import rightStep2 from './right-step-2.png';
import hit from './hit.png';
import weaponIdle from './weapon-idle.png';
import weapon1 from './weapon-1.png';
import weapon2 from './weapon-2.png';

export default {
  name: 'The Operative',
  front: {
    idle: frontIdle,
    punch: [frontPunch1, frontPunch2],
    step: [frontStep1, frontStep2],
    hit: hit,
  },
  left: {
    idle: leftIdle,
    punch: leftPunch,
    step: [leftStep1, leftStep2],
  },
  right: {
    idle: rightIdle,
    punch: rightPunch,
    step: [rightStep1, rightStep2],
  },
  behind: {
    idle: behindIdle,
    step: [behindStep1, behindStep2],
  },
  weapon: {
    idle: weaponIdle,
    punch: [weapon1, weapon2],
  }
};