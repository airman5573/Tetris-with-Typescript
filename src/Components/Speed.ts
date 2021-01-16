import Numbers from './numbers';

class Speed extends Numbers {
  title: string;
  titleEl: HTMLDivElement;
  constructor() {
    super('speed');
  }
  updateSpeed = (_speed: number) => {
    const gs = window.tetris.states;
    const speed = gs.speed + _speed;
    if (speed >= 1500) { gs.speed = 1500; }
    else if (speed >= 300) { gs.speed = speed; }
    else { gs.speed = 300; }
    this.render(gs.speed); 
  }
  reset = () => {
    this.updateSpeed(0);
    this.render(0);
  }
}

export default Speed