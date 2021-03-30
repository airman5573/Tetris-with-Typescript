import { Tetris } from '../../types';

class Numbers implements Tetris.INumbers {
  node: HTMLDivElement;

  constructor(className: string) {
    this.node = document.querySelector(`.game-screen > .sidebar .${className} > .led-numbers`);
  }

  render = (num: number) => {
    let arr: number[] = (Array.from(String(num), Number)).reverse();
    if (num === 0) { arr = [0]; }
    const len = this.node.children.length;
    const startIndex = len - arr.length;
    for (let i = 0; i < len; i += 1) {
      const el = this.node.children.item(i);
      if (i >= startIndex) el.className = `bg led-number ln-${arr.pop()}`;
      else el.className = 'bg led-number ln-empty';
    }
  };
}

export default Numbers;
