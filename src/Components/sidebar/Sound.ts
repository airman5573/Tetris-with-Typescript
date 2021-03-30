import { Tetris } from '../../types';

class Sound implements Tetris.ISound {
  node: HTMLDivElement;

  constructor() {
    this.node = document.querySelector('.game-screen > .sidebar .sound');
  }

  on = () => {
    this.render(1);
    window.tetris.states.sound = true;
  }

  off = () => {
    this.render(-1);
    window.tetris.states.sound = false;
  }

  render = (onoff: number) => {
    if (onoff === 1) this.node.classList.add('on');
    else this.node.classList.remove('on');
  }
}

export default Sound;
