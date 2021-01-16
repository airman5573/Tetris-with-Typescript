import Block from './block';

class Next {
  blocks: Array<NodeListOf<Element>>
  constructor() {
    this.blocks = [
      document.querySelectorAll(".status .next-block .line:nth-child(1) .b"),
      document.querySelectorAll(".status .next-block .line:nth-child(2) .b"),
    ]
  }
  render = (nextBlock: Block) => {
    this.reset();
    nextBlock.shape.forEach((line: number[], i) => {
      line.forEach((blockState:number, j) => {
        if (blockState == 1) {
          this.blocks[i][j].className = 'b active';
        }
      });
    })
  }
  reset = () => {
    this.blocks.forEach((line: NodeListOf<Element>, i) => {
      line.forEach((el:Element, j) => {
        el.className = 'b';
      });
    })
  }
}

export default Next