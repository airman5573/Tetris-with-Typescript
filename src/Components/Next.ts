import Block from './block';

class Next {
  blocks: Array<NodeListOf<Element>>
  constructor() {
    this.blocks = [
      document.querySelectorAll(".sidebar .next-block p:nth-child(1) b"),
      document.querySelectorAll(".sidebar .next-block p:nth-child(2) b"),
    ];
  }
  render = (nextBlock: Block = window.tetris.states.nextBlock) => {
    this.reset();
    if (nextBlock === null) return;
    nextBlock.shape.forEach((line: number[], i) => {
      line.forEach((blockState:number, j) => {
        if (blockState === 0) return;
        this.blocks[i][j].className = 'b black';
      });
    });
  }
  reset = () => {
    this.blocks.forEach((line: NodeListOf<Element>, i) => {
      line.forEach((el:Element, j) => {
        el.className = '';
      });
    });
  }
}

export default Next