import { Tetris } from '../types';

class Logo implements Tetris.ILogo {
  logo: HTMLDivElement;

  dragon: HTMLDivElement;

  timer: NodeJS.Timeout;

  basicClassName = 'dragon bg';

  constructor() {
    this.logo = document.querySelector('.game-screen > .logo');
    this.dragon = this.logo.children[0] as HTMLDivElement;
  }

  show = () => {
    this.logo.className = 'logo active';
  }

  hide = () => {
    this.logo.className = 'logo';
    clearTimeout(this.timer);
  }

  eye = (timeout: number) => new Promise<void>((resolve) => {
    const direction = 'r';
    const todos = [];
    for (let i = 0; i < 2; i += 1) {
      todos.push(this.dragonBGmove.bind(direction + 2, timeout));
      todos.push(this.dragonBGmove.bind(direction + 1, timeout));
    }
    Promise.all(todos).then(() => {
      resolve();
    });
  });

  run = (timeout: number) => new Promise<void>((resolve) => {
    let direction = 'r';
    const todos = [];
    for (let i = 0; i < 15; i += 1) {
      if (i === 6) direction = 'l';
      if (i === 10) direction = 'r';
      todos.push(this.dragonBGmove.bind(this, direction + 4, timeout));
      todos.push(this.dragonBGmove.bind(this, direction + 3, timeout));
    }
    resolve();
  });

  dragonBGmove = (className: string, timeout: number) => new Promise<void>((resolve) => {
    this.timer = setTimeout(() => {
      this.dragon.className = `${this.basicClassName} ${className}`;
      resolve();
    }, timeout);
  });

  animate = () => {
    this.dragon.className = `${this.basicClassName} r1`;
    this.timer = setTimeout(async () => {
      await this.run(100);
      await this.eye(600);
      this.animate();
    }, 500);
  }
}

export default Logo;
