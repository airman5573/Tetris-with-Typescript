import PQueue from 'p-queue';
import { Tetris } from '../types';

class Logo implements Tetris.ILogo {
  logo: HTMLDivElement;

  dragon: HTMLDivElement;

  timer: NodeJS.Timeout;

  queue: PQueue;

  basicClassName = 'dragon bg';

  constructor() {
    this.logo = document.querySelector('.game-screen > .logo');
    this.dragon = this.logo.children[0] as HTMLDivElement;
    this.queue = new PQueue({ concurrency: 1 });
  }

  show = () => {
    this.logo.className = 'logo active';
  }

  hide = () => {
    this.queue.clear();
    this.logo.className = 'logo';
    clearTimeout(this.timer);
  }

  eye = (timeout: number) => new Promise<void>(() => {
    const direction = 'r';
    for (let i = 0; i < 2; i += 1) {
      this.queue.add(this.dragonBGmove.bind(this, direction + 2, timeout));
      this.queue.add(this.dragonBGmove.bind(this, direction + 1, timeout));
    }
  });

  run = (timeout: number) => new Promise<void>(() => {
    let direction = 'r';
    for (let i = 0; i < 15; i += 1) {
      if (i === 6) direction = 'l';
      if (i === 10) direction = 'r';
      this.queue.add(this.dragonBGmove.bind(this, direction + 4, timeout));
      this.queue.add(this.dragonBGmove.bind(this, direction + 3, timeout));
    }
  });

  dragonBGmove = (className: string, timeout: number) => new Promise<void>((resolve) => {
    setTimeout(() => {
      this.dragon.className = `${this.basicClassName} ${className}`;
      resolve();
    }, timeout);
  });

  animate = () => new Promise<void>((resolve) => {
    this.queue.clear();
    this.dragon.className = `${this.basicClassName} r1`;
    this.timer = setTimeout(async () => {
      this.run(100);
      this.eye(600);
      this.queue.add(this.animate);
      this.queue.start();
      resolve();
    }, 2000);
  });
}

export default Logo;
