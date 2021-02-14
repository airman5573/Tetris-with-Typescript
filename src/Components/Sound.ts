class Sound {
  node: HTMLDivElement;
  constructor() {
    this.node = document.querySelector(`.game-screen > .sidebar .sound`);
  }
  render = (num: number) => {
  }
}

export default Sound;