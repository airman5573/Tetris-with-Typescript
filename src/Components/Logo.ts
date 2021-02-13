class Logo {
  logo: HTMLDivElement;
  dragon: HTMLDivElement;
  timer: NodeJS.Timeout;
  basicClassName = "dragon bg";
  constructor() {
    this.logo = document.querySelector(".game-screen > .logo");
    this.dragon = this.logo.children[0] as HTMLDivElement;
  }
  show = () => {
    this.logo.className = 'logo active';
  }
  hide = () => {
    this.logo.className = 'logo';
    clearTimeout(this.timer);
  }
  eye = (timeout: number) => {
    return new Promise<void>(async (resolve, reject) => {
      let direction = 'r';
      for(let i = 0; i < 2; i++) {
        await this.dragonBGmove(`${direction+2}`, timeout);
        await this.dragonBGmove(`${direction+1}`, timeout);
      }
      resolve();
    });
  }
  run = (timeout: number) => {
    return new Promise<void>(async (resolve, reject) => {
      let direction = 'r';
      for(let i = 0; i < 15; i++) {
        if (i == 6) { direction = 'l'; }
        if (i == 10) { direction = 'r'; }
        await this.dragonBGmove(`${direction+4}`, timeout);
        await this.dragonBGmove(`${direction+3}`, timeout);
      }
      resolve();
    });
  }
  dragonBGmove = (className: string, timeout: number) => {
    return new Promise<void>((resolve, reject) => {
      this.timer = setTimeout(() => {
        this.dragon.className = `${this.basicClassName} ${className}`;
        resolve();
      }, timeout);
    });
  }
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