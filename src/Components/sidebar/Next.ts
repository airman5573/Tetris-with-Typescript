import { Tetris } from '../../types';

class Next implements Tetris.INext {
  blocks: Array<NodeListOf<Element>>

  constructor() {
    this.blocks = [
      document.querySelectorAll('.sidebar .next-block p:nth-child(1) b'),
      document.querySelectorAll('.sidebar .next-block p:nth-child(2) b'),
    ];
  }

  render = (nextBlock: Tetris.IBlock = window.tetris.states.nextBlock) => {
    this.reset();
    console.log(nextBlock);
    if (nextBlock === null) return;
    nextBlock.shape.forEach((line: number[], i) => {
      line.forEach((blockState:number, j) => {
        if (blockState === 0) return;
        this.blocks[i][j].className = 'b black';
      });
    });
  }

  reset = () => {
    this.blocks.forEach((line: NodeListOf<Element>) => {
      line.forEach((el:Element) => {
        el.className = '';
      });
    });
  }
}

export default Next;
