import { Tetris } from '../types';

class Sound implements Tetris.ISound {
  node: HTMLDivElement;

  constructor() {
    this.node = document.querySelector('.game-screen > .sidebar .sound');
  }

  render = (num: number) => {
    console.log(num);
  }
}

export default Sound;
