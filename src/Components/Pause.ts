class Pause {
  node: HTMLDivElement;
  timer: NodeJS.Timeout;
  constructor() {
    this.node = document.querySelector(`.game-screen > .sidebar .pause`);
  }
  blink = (onoff: number) => {
    this.timer = setTimeout(() => {
      this.render(onoff);
      this.blink(onoff*-1);  
    }, 400);
  }
  off = () => {
    this.render(-1);
    clearTimeout(this.timer);
  }
  render = (onoff: number) => {
    if (onoff === 1) this.node.classList.add('on');
    else this.node.classList.remove('on');
  }
}

export default Pause;