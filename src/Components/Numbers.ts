class Numbers {
  node: HTMLDivElement;
  constructor(className: string) {
    this.node = document.querySelector(`.game-screen > .status > .${className} > .numbers`);
  }
  render = (num: number) => {
    let arr: number[] = (Array.from(String(num), Number)).reverse();
    if (num == 0) { arr = [0]; }
    const len = this.node.children.length;
    const startIndex = len - arr.length;
    for(let i = 0; i < len; i++) {
      const el = this.node.children.item(i);
      if (i >= startIndex) {
        el.className = `bg s_${arr.pop()}`;
      } else {
        el.className = `bg s_n`;
      }
    }
  }
}

export default Numbers;