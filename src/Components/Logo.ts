class Logo {
  logo: HTMLDivElement;
  dragon: HTMLDivElement;
  timer: NodeJS.Timeout;
  basicClassName = "dragon bg";
  constructor() {
    this.logo = document.querySelector(".game-screen > .matrix > .logo");
    this.dragon = this.logo.children[0] as HTMLDivElement;
  }
  show = () => {
    this.logo.className = 'logo active';
  }
  hide = () => {
    this.logo.className = 'logo';
    clearTimeout(this.timer);
  }
  eye = (callback: () => void) => {
    let count = 0;
    let cn = 'r';
    const f = (callback: () => void) => {
      this.timer = setTimeout(() => {
        this.dragon.className = `${this.basicClassName} ${cn+1}`;
        this.timer = setTimeout(() => {
          count += 1;
          if (count < 3) {
            this.dragon.className = `${this.basicClassName} ${cn+2}`;
            f(callback);
          }
          callback();
        }, 550);
      }, 550);
    }
    f(callback);
  }
  run = (callback: () => void) => {
    let count = 0
    let cn = 'r';
    const f = (callback: () => void) => {
      this.timer = setTimeout(() => {
        this.dragon.className = `${this.basicClassName} ${cn+4}`;
        this.timer = setTimeout(() => {
          count += 1;
          if (count == 10 || count == 20) {
            cn = cn === 'r' ? 'l' : 'r';
          }
          if (count < 30) {
            this.dragon.className = `${this.basicClassName} ${cn+3}`;
            f(callback);
          } else {
            this.dragon.className = `${this.basicClassName} ${cn+1}`;
          }
          callback();
        }, 150);
      }, 150);
    }
    f(callback);
  }
  animate = () => {
    this.dragon.className = `${this.basicClassName} r1`;
    this.timer = setTimeout(() => {
      this.run(() => {
        this.eye(() => {
          this.animate();
        })
      });
    }, 800);
  }
}