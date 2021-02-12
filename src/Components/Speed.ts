import Numbers from './numbers';
import {speeds} from '../const';

class Speed extends Numbers {
  title: string;
  titleEl: HTMLDivElement;
  constructor() {
    super('speed');
  }
  updateSpeed = (_speed: number) => {
    const states = window.tetris.states;
    const speed = speeds[states.speed] + _speed;
    if (speed >= 1500) { states.speed = 1500; }
    else if (speed >= 300) { states.speed = speed; }
    else { states.speed = 300; }
    this.render(states.speed); 
  }
  reset = () => {
    this.updateSpeed(0);
    this.render(0);
  }
}

export default Speed